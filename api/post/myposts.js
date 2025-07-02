const getUserBySessionCookie = require("../../systemServices/getUserBySessionCookie")
const { mainAuthTokenKey } = require('../../systemServices/globalVariables')
const prisma = require('../../systemServices/prisma')

exports.ROUTE = '/api/myposts'

exports.PERMISSIONS = ['REQUIRECOOKIE', 'REQUIREUSER']

exports.GET = async (req, res) => {
    const userToken = req.cookies[mainAuthTokenKey]
    const user = await getUserBySessionCookie(userToken)

    const userPosts = await prisma.post.findMany({
        where: {
            ownerid: user.id
        },
        include: {
            tags: {
                select: {
                    name: true,
                    group: {
                        select: {
                            basename: true,
                            name: true,
                            color: true
                        }
                    },
                    icon: true
                }
            },
            files: true
        },
        orderBy: {
            createdOn: 'desc'
        }
    })

    res.status(200).json({ posts: userPosts })
}