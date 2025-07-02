const { PostType, PostRating } = require('@prisma/client')

exports.ROUTE = '/api/posts/data'

exports.GET = async (req, res) => {
    const qData = req.query.q

    if (!qData) return res.status(400).send('No query provided')

    switch (qData) {
        case 'types': {
            res.status(200).json({ types: Object.keys(PostType) })
        }; return
        case 'rating': {
            res.status(200).json({ types: Object.keys(PostRating) })
        }; return
    }
}
