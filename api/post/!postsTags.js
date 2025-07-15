const prisma = require('../../systemServices/prisma')

exports.ROUTE = '/api/posts/tags'

exports.GET = async (req, res) => {

    if (!req.query?.q) return res.status(400).send('No text provided!')

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