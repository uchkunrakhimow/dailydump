const cron = require('node-cron');
const { exec } = require('child_process');
const util = require('util');
const path = require('path');
const fs = require('fs');
const execPromise = util.promisify(exec);

// MongoDB Configuration
const config = {
  dbUri: 'mongodb://127.0.0.1:27017/database', // MongoDB URI
  backupDir: path.join(__dirname, 'db'),       // Backup directory
  retentionDays: 7                             // Number of days to keep backups
};

// Function to create a backup
const createBackup = async () => {
  try {
    const DATE = new Date().toISOString().split('T')[0]; // Current date (e.g., "2024-12-25")
    const BACKUP_NAME = `backup-${DATE}`;               // Backup folder name
    const backupPath = path.join(config.backupDir, BACKUP_NAME);

    // Create the backup directory if it doesn't exist
    if (!fs.existsSync(config.backupDir)) {
      fs.mkdirSync(config.backupDir, { recursive: true });
    }

    // Construct the mongodump command
    const command = `mongodump --uri="${config.dbUri}" --out="${backupPath}"`;

    // Execute the command
    console.log(`Starting backup: ${backupPath}`);
    const { stdout, stderr } = await execPromise(command);

    if (stderr) {
      console.error(`Backup stderr: ${stderr}`);
    }

    console.log(`Backup successful: ${stdout}`);
    cleanOldBackups(); // Clean old backups after a successful backup
  } catch (error) {
    console.error(`Error during backup: ${error.message}`);
  }
};

// Function to clean old backups
const cleanOldBackups = () => {
  try {
    const files = fs.readdirSync(config.backupDir);
    const now = new Date();

    files.forEach((file) => {
      const filePath = path.join(config.backupDir, file);
      const stats = fs.statSync(filePath);

      // Calculate the file's age in days
      const ageInDays = (now - stats.mtime) / (1000 * 60 * 60 * 24);

      // Delete the file if it is older than the retention period
      if (ageInDays > config.retentionDays) {
        fs.rmSync(filePath, { recursive: true, force: true });
        console.log(`Deleted old backup: ${file}`);
      }
    });
  } catch (error) {
    console.error(`Error during cleanup: ${error.message}`);
  }
};

// Schedule the backup daily at 2:00 AM
cron.schedule('0 2 * * *', createBackup);
console.log('Backup scheduler is running...');
