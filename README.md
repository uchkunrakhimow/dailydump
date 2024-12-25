# MongoDB Backup Scheduler

This project automates the process of creating daily backups for a MongoDB database using `mongodump` and `node-cron`. It ensures that backups are created consistently and old backups are cleaned up based on a retention policy.

## Features

- **Daily Backups**: Automates daily backups at 2:00 AM using `cron` jobs.
- **Retention Policy**: Automatically deletes backups older than the configured retention period (default: 7 days).
- **Configurable Settings**: Easily adjust the MongoDB URI, backup directory, and retention days.
- **PM2 Support**: Use `PM2` for process management to ensure the script runs continuously and restarts on server crashes.

## Prerequisites

1. **Node.js**: Install [Node.js](https://nodejs.org/).
2. **MongoDB Tools**: Ensure `mongodump` is installed. You can install it from the [MongoDB Database Tools](https://www.mongodb.com/try/download/database-tools).
3. **PM2 (optional)**: Install PM2 for process management:

```bash
npm install -g pm2
pm2 start index.js --name "mongo-backup-scheduler"
```
