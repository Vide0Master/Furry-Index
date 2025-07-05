const getUserBySessionCookie = require("../../systemServices/getUserBySessionCookie")
const { mainAuthTokenKey } = require('../../systemServices/globalVariables')
const prisma = require('../../systemServices/prisma')
const sendFileByName = require("../../systemServices/sendFileByName")

exports.ROUTE = '/api/posts/:postID/file/:fileID'

exports.GET = async (req, res) => {
    const user = await getUserBySessionCookie(req.cookies[mainAuthTokenKey] || null)

    const postID = req.params.postID
    const fileID = req.params.fileID

    const post = await prisma.post.findUnique({
        where: {
            id: postID
        },
        select: {
            rating: true
        }
    })

    if(!post) {
        res.status(404).send('Post not found')
        return
    }

    const file = await prisma.file.findUnique({
        where: {
            id: fileID
        },
        select: {
            file: true
        }
    })

    if(!file) {
        res.status(404).send('File not found')
        return
    }

    const bypassCheck = req.query.bypass == 'true'

    sendFileByName(res, file.file, !user && post.rating == 'mature' && !bypassCheck)
}