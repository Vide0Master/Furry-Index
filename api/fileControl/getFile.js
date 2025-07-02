const getUserBySessionCookie = require("../../systemServices/getUserBySessionCookie")
const { mainAuthTokenKey } = require('../../systemServices/globalVariables')
const prisma = require('../../systemServices/prisma')
const sendFile = require('../../systemServices/sendFileByName')

exports.ROUTE = '/file/:fileID'
exports.PERMISSIONS = ['REQUIRECOOKIE', 'REQUIREUSER']

exports.GET = async (req, res) => {
    const userToken = req.cookies[mainAuthTokenKey]
    const user = await getUserBySessionCookie(userToken)

    const fileID = req.params.fileID

    const file = await prisma.file.findUnique({
        where: {
            fileid: fileID
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