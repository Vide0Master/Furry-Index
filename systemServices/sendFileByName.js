const path = require('path')
const fs = require('fs')
const mime = require('mime-types')
const ffmpeg = require('fluent-ffmpeg')
const sharp = require('sharp')
const prisma = require('./prisma')

const blurMult = 0.075

module.exports = async function sendFileByName(res, filename, blur) {
    const req = res.req;
    const filePath = path.join(__dirname, '../file_storage', filename);

    let stat;
    try {
        stat = await fs.promises.stat(filePath);
    } catch {
        return res.status(404).send('File not found');
    }

    const filestats = (await prisma.file.findUnique({
        where: {
            file: filename
        },
        select: {
            fileparams: true
        }
    })).fileparams

    const fileSize = stat.size;
    const range = req.headers.range;
    const contentType = mime.lookup(filePath) || 'application/octet-stream';
    const thumbnailHeight = parseInt(req.query?.thumbnail, 10);

    // Определяем, нужно ли применять блюр
    const blurParam = typeof req.query.blur === 'string' ? req.query.blur.toLowerCase() : '';
    const shouldBlur =
        blur === true ||
        blurParam === 'true' || blurParam === '1' || blurParam === 'yes';

    const blurPower = Math.min(200, Math.max(0.3, Math.min(filestats.width || 1000, filestats.height || 1000, thumbnailHeight||1000) * blurMult))

    if (thumbnailHeight && !isNaN(thumbnailHeight)) {
        if (contentType.startsWith('video/') || contentType === 'application/mp4') {
            const command = ffmpeg(filePath)
                .seekInput(0)
                .frames(1)
                .format('mjpeg');

            const chunks = [];
            let responded = false;
            const safeError = (msg) => {
                if (!responded && !res.headersSent) {
                    responded = true;
                    res.status(500).send(msg);
                }
            };

            command.on('error', err => {
                console.error('FFmpeg error:', err);
                safeError('Error generating thumbnail');
            });

            const ffmpegStream = command.pipe();
            ffmpegStream.on('data', c => chunks.push(c));
            ffmpegStream.on('end', async () => {
                if (responded) return;
                if (chunks.length === 0) {
                    console.error('FFmpeg did not return any data');
                    return safeError('No thumbnail data generated');
                }
                try {
                    let image = sharp(Buffer.concat(chunks)).resize({ height: thumbnailHeight });
                    if (shouldBlur) {
                        image = image.blur(blurPower);
                    }
                    const resized = await image.jpeg().toBuffer();

                    if (!res.headersSent) {
                        res.writeHead(200, {
                            'Content-Type': 'image/jpeg',
                            'Content-Length': resized.length,
                        });
                        res.end(resized);
                    }
                } catch (err) {
                    console.error('Sharp error:', err);
                    safeError('Error processing thumbnail');
                }
            });

            return;
        }

        if (contentType.startsWith('image/')) {
            try {
                let image = sharp().resize({ height: thumbnailHeight });
                if (shouldBlur) {
                    image = image.blur(blurPower);
                }

                const resizedStream = fs.createReadStream(filePath).pipe(image);
                res.writeHead(200, { 'Content-Type': contentType });
                return resizedStream.pipe(res);
            } catch (err) {
                console.error('Image resize error:', err);
                return res.status(500).send('Error resizing image');
            }
        }

        return res.status(400).send('Thumbnail preview not supported for this file type');
    }

    if (contentType.startsWith('image/') && shouldBlur) {
        try {
            let image = sharp().blur(blurPower);
            const stream = fs.createReadStream(filePath).pipe(image);
            const outputBuffer = await streamToBuffer(stream);

            res.writeHead(200, {
                'Content-Type': contentType,
                'Content-Length': outputBuffer.length,
            });
            return res.end(outputBuffer);
        } catch (err) {
            console.error('Full image blur error:', err);
            return res.status(500).send('Error processing image');
        }
    }

    if (range) {
        const [startStr, endStr] = range.replace(/bytes=/, '').split('-');
        const start = parseInt(startStr, 10);
        const end = endStr ? parseInt(endStr, 10) : fileSize - 1;
        if (start >= fileSize || end >= fileSize) {
            return res.status(416).send('Requested Range Not Satisfiable');
        }
        const chunkSize = end - start + 1;
        res.writeHead(206, {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': contentType,
        });
        return fs.createReadStream(filePath, { start, end }).pipe(res);
    }

    res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': contentType,
        'Accept-Ranges': 'bytes',
    });
    fs.createReadStream(filePath).pipe(res);
};

function streamToBuffer(stream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on('data', chunk => chunks.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(chunks)));
        stream.on('error', err => reject(err));
    });
}
