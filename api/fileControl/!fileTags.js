const getUserBySessionCookie = require("../../systemServices/getUserBySessionCookie")
const { mainAuthTokenKey } = require('../../systemServices/globalVariables')
const prisma = require('../../systemServices/prisma')

exports.PERMISSIONS = ['REQUIRECOOKIE', 'REQUIREUSER']

exports.ROUTE = '/api/files/tags'

exports.GET = async (req, res) => {
    const user = await getUserBySessionCookie(req.cookies[mainAuthTokenKey])

    if (!req.query?.q) return res.status(400).send('No text provided!')

    const tagsMatch = await prisma.tag.findMany({
        where: {
            name: {
                startsWith: req.query.q,
                mode: 'insensitive'
            },
            groupname: 'meta'
        },
        include: {
            group: true
        },
        orderBy: { name: 'asc' },
        take: 10
    })

    for (const tag of tagsMatch) {
        const count = await prisma.file.count({
            where: {
                tags: { some: { name: tag.name } },
                ownerid: user.id
            }
        })
        tag.count = count
    }

    return res.status(200).json({ complete: tagsMatch })
}