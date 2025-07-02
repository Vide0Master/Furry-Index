const getUserBySessionCookie = require("../../systemServices/getUserBySessionCookie")
const { mainAuthTokenKey } = require('../../systemServices/globalVariables')
const prisma = require('../../systemServices/prisma')

exports.ROUTE = '/api/file-manager'

exports.PERMISSIONS = ['REQUIRECOOKIE', 'REQUIREUSER']

exports.GET = async (req, res) => {
    const userToken = req.cookies[mainAuthTokenKey]
    const user = await getUserBySessionCookie(userToken)

    const page = req.query.p ? parseInt(req.query.p) : 0
    const take = req.query.t ? parseInt(req.query.t) : 50
    const tagFilter = req.query.tags
        ? req.query.tags.split('+').map(tag => tag.trim())
        : null

    const userFiles = await prisma.file.findMany({
        skip: page * take,
        take,
        where: {
            post: req.query.inuse == 'false' ? {
                none: {}
            } : undefined,
            ownerid: user.id,
            ...(tagFilter && {
                tags: {
                    some: {
                        name: { in: tagFilter }
                    }
                }
            })
        },
        orderBy: { createdAt: 'desc' },
        select: {
            fileid: true,
            filetype: true,
            fileparams: true,
            createdAt: true,
            updatedAt: true,
            tags: {
                orderBy: {
                    name: 'asc'
                },
                select: {
                    name: true,
                    icon: true,
                    group: {
                        select: {
                            basename: true,
                            color: true,
                            name: true
                        }
                    }
                }
            },
            post: true
        }
    })
    return res.status(200).json({ files: userFiles })
}
