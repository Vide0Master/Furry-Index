const prisma = require("../prisma.js");
const removeFile = require("../removeFile.js");
const path = require("path");
const fs = require("fs").promises;
const cmd = require("../cmdPretty.js");

const FILE_STORAGE = path.join(__dirname, "../../file_storage");

const delay = new Date();
delay.setDate(delay.getDate() - 1);

async function checkAndRmOldFiles() {
    // 1. Удаляем старые файлы из базы
    const filesToRm = await prisma.file.findMany({
        where: {
            AND: [
                { post: { is: null } },
                { avatarfor: { is: null } },
                { updatedAt: { lte: delay } }
            ]
        }
    });

    if (filesToRm.length > 0) {
        cmd.info(`Purging ${filesToRm.length} files...`, [cmd.preps.System, cmd.preps.fs]);

        for (const file of filesToRm) {
            const filePath = path.join(FILE_STORAGE, file.file);
            await removeFile(filePath);

            // Удаляем превью
            const ext = path.extname(file.file);
            const thumbPath = path.join(FILE_STORAGE, path.basename(file.file, ext) + "_thumbnail.jpg");
            await removeFile(thumbPath);

            await prisma.file.delete({
                where: { id: file.id }
            });
        }

        cmd.awesome(`Purge of ${filesToRm.length} files finished!`, [cmd.preps.System, cmd.preps.fs]);
    } else {
        cmd.info(`No files for purging found... skipping`, [cmd.preps.System, cmd.preps.fs]);
    }

    // 2. Проверяем лишние файлы
    try {
        const filesInDir = await fs.readdir(FILE_STORAGE);
        const dbFiles = (await prisma.file.findMany({ select: { file: true } }))
            .map(f => f.file);

        const baseNamesInDb = new Set(dbFiles.map(f => path.basename(f, path.extname(f))));

        const orphanFiles = [];
        for (const f of filesInDir) {
            const isThumb = f.endsWith("_thumbnail.jpg");
            const nameWithoutThumb = isThumb ? f.replace(/_thumbnail\.jpg$/, "") : path.basename(f, path.extname(f));

            // Если это оригинал и его нет в базе — он сирота
            if (!isThumb && !dbFiles.includes(f)) {
                orphanFiles.push(f);
                continue;
            }

            // Если это превью — проверяем наличие оригинала в базе
            if (isThumb && !baseNamesInDb.has(nameWithoutThumb)) {
                orphanFiles.push(f);
            }
        }

        if (orphanFiles.length > 0) {
            cmd.info(`Found ${orphanFiles.length} orphan files. Removing...`, [cmd.preps.System, cmd.preps.fs]);
            for (const f of orphanFiles) {
                const fullPath = path.join(FILE_STORAGE, f);
                await removeFile(fullPath);
            }
            cmd.awesome(`Removed ${orphanFiles.length} orphan files`, [cmd.preps.System, cmd.preps.fs]);
        } else {
            cmd.info(`No orphan files found`, [cmd.preps.System, cmd.preps.fs]);
        }
    } catch (err) {
        console.error("Error scanning file storage:", err);
    }
}

checkAndRmOldFiles();

module.exports = checkAndRmOldFiles;
