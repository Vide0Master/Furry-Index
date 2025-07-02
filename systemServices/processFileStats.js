const prisma = require('./prisma')
const path = require('path')
const fs = require('fs/promises')
const ffmpeg = require('fluent-ffmpeg')
const sharp = require('sharp')

module.exports = async function processFileStats(fileid, onFinish, resultFlags = { convertedFromGif: false, videoReencoded: false, audioReencoded: false }, tags = []) {
    const filedata = await prisma.file.findUnique({ where: { fileid } })
    if (!filedata) {
        return
    }

    const originalFile = filedata.file
    const filepath = path.resolve(__dirname, '../file_storage', originalFile)
    const fileExt = path.extname(originalFile).slice(1).toLowerCase()

    const stats = {}

    try {
        stats.size = (await fs.stat(filepath)).size
    } catch (err) {
        return
    }

    const markLocked = async (value) => {
        await prisma.file.update({ where: { fileid }, data: { locked: value } })
    }

    if (['mp4', 'webm', 'mkv'].includes(fileExt)) {
        let metadata
        try {
            metadata = await new Promise((resolve, reject) => {
                ffmpeg.ffprobe(filepath, (err, data) => {
                    if (err) reject(err)
                    else resolve(data)
                })
            })
        } catch {
            return
        }

        const videoStream = metadata.streams.find(s => s.codec_type === 'video')
        const audioStream = metadata.streams.find(s => s.codec_type === 'audio')
        const format = metadata.format

        if (audioStream) tags.push({ name: 'sound' })

        stats.width = videoStream?.width || null
        stats.height = videoStream?.height || null
        stats.duration = format?.duration || null

        const videoCodec = videoStream?.codec_name || 'none'
        const audioCodec = audioStream?.codec_name || 'none'

        const unsupportedVideo = !['h264'].includes(videoCodec)
        const unsupportedAudio = !!audioStream && !['aac'].includes(audioCodec)

        resultFlags.videoReencoded = unsupportedVideo
        resultFlags.audioReencoded = unsupportedAudio

        if (unsupportedVideo || unsupportedAudio) {
            await markLocked(true)

            const tempPath = filepath + '.tmp.mp4'

            try {
                await new Promise((resolve, reject) => {
                    ffmpeg(filepath)
                        .videoCodec('libx264')
                        .audioCodec('aac')
                        .outputOptions(['-movflags faststart', '-pix_fmt yuv420p'])
                        .on('end', resolve)
                        .on('error', reject)
                        .save(tempPath)
                })

                await fs.unlink(filepath)
                await fs.rename(tempPath, filepath)
            } catch (err) {
            }

            await markLocked(false)
            return await processFileStats(fileid, onFinish)
        }
        tags.push({ name: 'animated' })
    } else if (fileExt === 'gif') {
        await markLocked(true)

        const tempPath = filepath.replace(/\.gif$/, '.temp.mp4')
        const finalPath = filepath.replace(/\.gif$/, '.mp4')

        try {
            await new Promise((resolve, reject) => {
                ffmpeg(filepath)
                    .outputOptions(['-movflags faststart', '-pix_fmt yuv420p', '-vf scale=trunc(iw/2)*2:trunc(ih/2)*2'])
                    .videoCodec('libx264')
                    .on('end', resolve)
                    .on('error', reject)
                    .save(tempPath)
            })

            await fs.unlink(filepath)
            await fs.rename(tempPath, finalPath)

            await prisma.file.update({
                where: { fileid },
                data: {
                    filetype: 'mp4',
                    file: path.basename(finalPath)
                }
            })

            resultFlags.convertedFromGif = true
        } catch (err) {
        }

        await markLocked(false)
        return await processFileStats(fileid, onFinish, resultFlags, tags)
    } else {
        tags.push({ name: 'image' })
        try {
            const image = sharp(filepath)
            const meta = await image.metadata()
            stats.width = meta.width
            stats.height = meta.height
        } catch (err) {
        }
    }

    if (stats.duration) {
        switch (true) {
            case stats.duration > 600: {
                tags.push({ name: 'absurd_playtime' })
            }; break;
            case stats.duration > 60: {
                tags.push({ name: 'long_playtime' })
            }; break;
            case stats.duration <= 60: {
                tags.push({ name: 'short_playtime' })
            }; break;
        }
    }

    if (stats.width && stats.height) {
        switch (true) {
            case stats.height > 2160: {
                tags.push({ name: 'absurd_res' })
            }; break;
            case stats.height > 1080: {
                tags.push({ name: 'high_res' })
            }; break;
        }
    }

    await prisma.file.update({
        where: { fileid },
        data: {
            fileparams: stats,
            tags: {
                set: tags
            }
        }
    })

    await markLocked(false)
    if (typeof onFinish === 'function') {
        try {
            await onFinish(resultFlags)
        } catch (err) {
        }
    }
}
