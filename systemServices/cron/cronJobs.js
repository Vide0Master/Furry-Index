const cron = require('node-cron');
const checkAndRmOldFiles = require('./filePersistencyChecker');
const checkExpiredSessions = require('./clearSessions');

// Each day at 12:00 at Kiev
cron.schedule('0 0 * * *', async () => {
    checkAndRmOldFiles()
}, {
    scheduled: true,
    timezone: 'Europe/Kiev'
});

// Each hour of day
cron.schedule('0 * * * *', async () => {
    checkExpiredSessions()
}, {
    scheduled: true,
    timezone: 'Europe/Kiev'
});