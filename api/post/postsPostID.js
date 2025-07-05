const getUserBySessionCookie = require("../../systemServices/getUserBySessionCookie")
const { mainAuthTokenKey } = require('../../systemServices/globalVariables')
const prisma = require('../../systemServices/prisma')

exports.ROUTE = '/api/posts/:postID'

exports.GET = async (req, res) => {
    const user = await getUserBySessionCookie(req.cookies[mainAuthTokenKey] || null)

    const postID = req.params.postID

    const post = await prisma.post.findUnique({
        where: {
            id: postID
        },
        include: {
            files: {
                select: {
                    id: true,
                    fileparams: true
                }
            },
            tags: {
                select: {
                    name: true,
                    icon: true,
                    group: {
                        select: {
                            basename: true,
                            name: true,
                            color: true,
                        }
                    }
                }
            },
            owner: {
                select: {
                    username: true,
                    visiblename: true,
                    avatarID: true
                }
            }
        }
    })

    if (!post.visible && user?.id != post.ownerid) return res.status(403).send('Post is not available')

    res.status(200).json({ post })
}

exports.PUT = async (req, res) => {
    const user = await getUserBySessionCookie(req.cookies[mainAuthTokenKey] || null)
    if (!user) return res.status(401).send()

    const postID = req.params.postID

    if (!postID)
        return res.status(400).send('No postID in route')

    if (!req.body)
        return res.status(400), send('No body request')

    const restricted = ['id', 'ownerid', 'owner', 'createdOn'];
    if (Object.keys(req.body).some(key => restricted.includes(key))) {
        return res.status(403).send('Cant edit restricted fields');
    }

    if (req.body.files) {
        req.body.files = { set: req.body.files.map((id) => ({ id })) }
    }

    try {
        await prisma.post.update({
            where: {
                id: postID,
                ownerid: user.id
            },
            data: req.body
        })
        return res.status(200).json({ updated: true })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ updated: false })
    }
}

exports.DELETE = async (req, res) => {
    const user = await getUserBySessionCookie(req.cookies[mainAuthTokenKey] || null)
    if (!user) return res.status(401).send()

    const postID = req.params.postID

    if (!postID) return res.status(400).send('No postID in route')


    const rm = await prisma.post.deleteMany({
        where: {
            id: postID,
            ownerid: user.id
        }
    })

    if (rm.count == 0) return res.status(403).send('Removal denied')

    return res.status(200).send('Post removed successfully')
}