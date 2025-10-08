const path = require("path");
const fs = require("fs");
const mime = require("mime-types");
const ffmpeg = require("fluent-ffmpeg");
const sharp = require("sharp");

module.exports = async function sendFileByName(res, filename) {
    const req = res.req;
    const filePath = path.join(__dirname, "../file_storage", filename);

    try {
        await fs.promises.access(filePath);
    } catch {
        return res.status(404).send("File not found");
    }

    const thumbnailRequested = req.query?.thumbnail !== undefined;
    const thumbPath = path.join(__dirname, "../file_storage", path.basename(filename, path.extname(filename)) + "_thumbnail.jpg");

    if (thumbnailRequested) {
        try {
            await fs.promises.access(thumbPath);
            // если превью уже есть, отправляем
            return sendFileWithCache(res, thumbPath);
        } catch {
            // превью ещё нет, создаём
            const contentType = mime.lookup(filePath) || "";

            if (contentType.startsWith("image/")) {
                try {
                    await sharp(filePath)
                        .resize({ height: 500 })
                        .jpeg()
                        .toFile(thumbPath);
                    return sendFileWithCache(res, thumbPath);
                } catch (err) {
                    console.error("Sharp error:", err);
                    return res.status(500).send("Error generating thumbnail");
                }
            }

            if (contentType.startsWith("video/") || contentType === "application/mp4") {
                try {
                    await new Promise((resolve, reject) => {
                        ffmpeg(filePath)
                            .seekInput(0)
                            .frames(1)
                            .outputOptions("-qscale:v 2")
                            .output(thumbPath)
                            .on("end", resolve)
                            .on("error", reject)
                            .run();
                    });
                    return sendFileWithCache(res, thumbPath);
                } catch (err) {
                    console.error("FFmpeg error:", err);
                    return res.status(500).send("Error generating thumbnail");
                }
            }

            return res.status(400).send("Thumbnail preview not supported for this file type");
        }
    } else {
        // обычная отправка файла
        return sendFileWithCache(res, filePath);
    }
};

// функция отправки файла через res.sendFile с поддержкой range и etag
function sendFileWithCache(res, filePath) {
    const stat = fs.statSync(filePath);
    const options = {
        headers: {
            "Content-Type": mime.lookup(filePath) || "application/octet-stream",
            "Content-Length": stat.size,
            "Cache-Control": "public, max-age=3600",
        },
        etag: true,
    };

    res.sendFile(filePath, options, (err) => {
        if (err) {
            console.error("SendFile error:", err);
            if (!res.headersSent) res.status(500).send("Error sending file");
        }
    });
}
