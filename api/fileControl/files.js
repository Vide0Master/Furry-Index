const getUserBySessionCookie = require("../../systemServices/getUserBySessionCookie")
const { mainAuthTokenKey } = require('../../systemServices/globalVariables')
const prisma = require('../../systemServices/prisma')

exports.ROUTE = '/api/files'

exports.PERMISSIONS = ['REQUIRECOOKIE', 'REQUIREUSER']

exports.GET = async (req, res) => {
    const userToken = req.cookies[mainAuthTokenKey]
    const user = await getUserBySessionCookie(userToken)

    const page = req.query.p ? parseInt(req.query.p) : 0
    const take = req.query.t ? parseInt(req.query.t) : 50
    const tagFilter = req.query.tags
        ? req.query.tags.split('+').map(tag => tag.trim())
        : null

    const inUse = req.query.inuse
    const baseWhere = {
        ownerid: user.id,
        ...(tagFilter && {
            tags: {
                some: { name: { in: tagFilter } }
            }
        })
    }

    let postFilter
    if (inUse === 'false') {
        postFilter = {
            post: null,
            avatarfor: null
        }
    } else if (inUse?.startsWith('postID:')) {
        const postID = inUse.split(':', 2)[1]
        postFilter = {
            OR: [
                { post: { id: postID } },
                { post: null }
            ],
            avatarfor: null
        }
    } else if (inUse?.startsWith('avatarID')) {
        postFilter = {
            OR: [
                { avatarfor: { id: user.id } },
                { avatarfor: null }
            ],
            post: null
        }
    } else {
        postFilter = {}
    }

    const userFiles = await prisma.file.findMany({
        skip: page * take,
        take,
        where: {
            AND: [
                baseWhere,
                postFilter
            ]
        },
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            filetype: true,
            fileparams: true,
            createdAt: true,
            updatedAt: true,
            tags: {
                orderBy: { name: 'asc' },
                select: {
                    name: true,
                    icon: true,
                    group: {
                        select: { basename: true, color: true, name: true }
                    }
                }
            },
            post: true,
            avatarfor: {
                select: {
                    username: true
                }
            }
        }
    })

    return res.status(200).json({ files: userFiles })
}
