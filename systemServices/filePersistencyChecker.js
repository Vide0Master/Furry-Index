const prisma = require('./prisma.js')
const cron = require('node-cron');
const removeFile = require('./removeFile.js');
const path = require('path');
const cmd = require('./cmdPretty.js');

const delay = new Date();
delay.setDate(delay.getDate() - 1);

cron.schedule('0 0 * * *', async () => {
    const filesToRm = await prisma.file.findMany({
        AND: [
            { post: { is: null } },
            { avatarfor: { is: null } },
            { updatedAt: { lte: delay } }
        ]
    })
    if (filesToRm.length > 0) {
        cmd.info(`Purging ${filesToRm.length} files`, [cmd.preps.System, cmd.preps.fs])

        for (const file of filesToRm) {
            await removeFile(path.join(__dirname, `../file_storage/${file.file}`))
        }

        cmd.awesome(`Purge of ${filesToRm.length} files finished!`, [cmd.preps.System, cmd.preps.fs])
    } else {
        cmd.info(`No files for purging found...`, [cmd.preps.System, cmd.preps.fs])
    }
}, {
    scheduled: true,
    timezone: 'Europe/Kiev'
});
