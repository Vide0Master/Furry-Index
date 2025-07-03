const getUserBySessionCookie = require("../../systemServices/getUserBySessionCookie")
const { mainAuthTokenKey } = require('../../systemServices/globalVariables')
const prisma = require('../../systemServices/prisma')
const sendFileByName = require("../../systemServices/sendFileByName")

exports.ROUTE = '/api/posts/:postID/file/:fileID'

exports.GET = async (req, res) => {
    const user = await getUserBySessionCookie(req.cookies[mainAuthTokenKey] || null)

    const postID = req.params.postID
    const fileid = req.params.fileID

    const post = await prisma.post.findUnique({
        where: {
            id: postID
        },
        select: {
            rating: true
        }
    })

    const file = await prisma.file.findUnique({
        where: {
            fileid
        },
        select: {
            file: true
        }
    })

    const bypassCheck = req.query.bypass == 'true'
    
    sendFileByName(res, file.file, !user && post.rating == 'mature' && !bypassCheck)
}