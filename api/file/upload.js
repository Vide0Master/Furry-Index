const getUserBySessionCookie = require("../../systemServices/getUserBySessionCookie")
const { mainAuthTokenKey } = require('../../systemServices/globalVariables')
const fs = require('fs')
const os = require('os')
const path = require('path')
const { formidable } = require('formidable')
const prisma = require('../../systemServices/prisma')
const fileDataProcessor = require('../../systemServices/processFileStats')

function getUploadHashHandle(Fhash, uname) {
    return Fhash + "!" + uname
}

exports.ROUTE = '/api/upload'

exports.PERMISSIONS = ['REQUIRECOOKIE', 'REQUIREUSER']

const chunkStorage = {}

exports.GET = async (req, res) => {
    const userToken = req.cookies[mainAuthTokenKey]
    const user = await getUserBySessionCookie(userToken)
    const fileHash = req.query.hash
    if (!fileHash) return res.status(400).send('No hash provided')

    const filetype = req.query.filetype
    if (!filetype) return res.status(400).send('No filetype provided')

    const internalHash = getUploadHashHandle(fileHash, user.username)

    const uploadHandle = chunkStorage[internalHash]

    if (req.query.process == 'start') {
        if (!uploadHandle) res.status('404').send('No handle found')

        if (uploadHandle.timeout) {
            clearTimeout(uploadHandle.timeout)
        }

        fileDataProcessor(uploadHandle.id, (result) => {
            res.status(200).json(result)
            delete chunkStorage[internalHash]
        })

        return
    }

    const segmentsCount = req.query.segments
    if (!segmentsCount) return res.status(400).send('No segments count provided')

    if (uploadHandle) {
        res.status(300).json({ handle: internalHash })
    } else {
        chunkStorage[internalHash] = {
            filename: `${user.username}-${Date.now()}-${fileHash}.${filetype}`,
            segmentsCount: segmentsCount,
            segments: {}
        }
        res.status(200).json({ handle: internalHash })
    }

    return
}

exports.POST = async (req, res) => {
    const userToken = req.cookies[mainAuthTokenKey]
    const user = await getUserBySessionCookie(userToken)

    if (!user) return res.status(401).send('Unauthorized')

    const form = formidable({
        multiples: false,
        uploadDir: os.tmpdir(),
        keepExtensions: true
    })

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error('Form parsing error:', err)
            return res.status(500).send('Form parsing error')
        }

        const { segmentID, handle } = fields
        const fileEntry = Array.isArray(files.segment) ? files.segment[0] : files.segment

        if (!fileEntry || !fileEntry.filepath || segmentID === undefined || !handle) {
            return res.status(400).send('Missing segment, segmentID, or handle')
        }

        const upload = chunkStorage[handle]
        if (!upload) {
            return res.status(404).send('Upload handle not found')
        }

        const chunkIndex = parseInt(segmentID)
        const chunkBuffer = fs.readFileSync(fileEntry.filepath)
        upload.segments[chunkIndex] = chunkBuffer

        const allSegmentsUploaded = Object.keys(upload.segments).length == upload.segmentsCount

        if (allSegmentsUploaded) {
            const outputDir = path.join(__dirname, '../../file_storage')
            fs.mkdirSync(outputDir, { recursive: true })

            const savePath = path.join(outputDir, upload.filename)
            const writeStream = fs.createWriteStream(savePath)

            for (let i = 0; i < upload.segmentsCount; i++) {
                writeStream.write(upload.segments[i])
            }

            writeStream.end(async () => {
                try {
                    const filedata = await prisma.file.create({
                        data: {
                            file: upload.filename,
                            filetype: upload.filename.split('.').pop() || 'unknown',
                            ownerid: user.id,
                            fileparams: {},
                            locked: true
                        },
                        select: {
                            id: true
                        }
                    })

                    res.status(200).send('Builded!')

                    chunkStorage[handle].timeout = setTimeout(() => {
                        fileDataProcessor(filedata.id)
                    }, 1000);

                    chunkStorage[handle].id = filedata.id
                } catch { }
            })

            return
        }

        return res.status(202).send('Segment accepted')
    })
}