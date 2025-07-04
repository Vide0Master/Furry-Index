const getUserBySessionCookie = require("../../systemServices/getUserBySessionCookie")
const { mainAuthTokenKey } = require('../../systemServices/globalVariables')
const prisma = require('../../systemServices/prisma')
const sendFile = require('../../systemServices/sendFileByName')
const removeFile = require("../../systemServices/removeFile")
const path = require('path')

exports.ROUTE = '/file/:fileID'

exports.PERMISSIONS = ['REQUIRECOOKIE', 'REQUIREUSER']

exports.GET = async (req, res) => {
    const user = await getUserBySessionCookie(req.cookies[mainAuthTokenKey])

    const fileID = req.params.fileID

    const file = await prisma.file.findUnique({
        where: {
            id: fileID
        },
        select: {
            file: true,
            ownerid: true
        }
    })

    if (file.ownerid != user.id) return res.status(403).send('You dont have acces to this file')

    if (!file) return res.status(404).send('File not found')

    sendFile(res, file.file)
    return
}

exports.DELETE = async (req, res) => {
    const user = await getUserBySessionCookie(req.cookies[mainAuthTokenKey])

    const fileID = req.params.fileID
    if (!fileID) return res.status(400).send('No fileID provided')

    const file = await prisma.file.findUnique({
        where: {
            id: fileID
        },
        include: {
            owner: {
                select: {
                    id: true
                }
            },
            post: true
        }
    })

    if (!file) return res.status(400).send('File record was not found')

    if (file.owner.id != user.id) return res.status(403).send('You don\'t have permission to remove this file')

    if(file.post) return res.status(400).send('Post is linked to file!')

    const fileRemovalResult = await removeFile(path.join(__dirname, `../../file_storage/${file.file}`))

    if (!fileRemovalResult && !req.query.force == 'true') return res.status(500).send('File removal error!')

    const DBRemove = await prisma.file.delete({
        where: {
            id: fileID
        }
    })

    if (!DBRemove) return res.status(500).send('Erorr removing file record from database!')

    return res.status(200).send('File removed')
}
