const prisma = require('../../systemServices/prisma')
const getUserBySessionCookie = require("../../systemServices/getUserBySessionCookie")
const { mainAuthTokenKey } = require('../../systemServices/globalVariables')

exports.ROUTE = '/api/posts/tags'

const metaGroup = {
    basename: 'meta',
    name: { RU: 'Мета', UA: 'Мета', ENG: 'Meta' },
    color: "#ffffff"
}

exports.GET = async (req, res) => {
    const user = await getUserBySessionCookie(req.cookies[mainAuthTokenKey] || null);

    if (!req?.query?.q) return res.status(400).send('No text provided!')

    switch (req.query.q) {
        case 'fav:': {
            return res.status(200).json({
                complete: [
                    !!user ?
                        {
                            name: 'fav:server',
                            icon: 'wrench',
                            group: metaGroup
                        }
                        :
                        {
                            name: 'fav:local',
                            icon: 'wrench',
                            group: metaGroup
                        }
                ]
            })
        }
        default: {
            const tagsMatch = await prisma.tag.findMany({
                where: {
                    name: {
                        startsWith: req.query.q,
                        mode: 'insensitive'
                    }
                },
                include: {
                    _count: true,
                    group: true
                },
                orderBy: { name: 'asc' },
                take: 10
            })

            for (const tag of tagsMatch) {
                tag.count = tag._count.posts;
                delete tag._count
            }

            return res.status(200).json({ complete: tagsMatch })
        }
    }
}