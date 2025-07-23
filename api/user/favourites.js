const getUserBySessionCookie = require("../../systemServices/getUserBySessionCookie")
const { mainAuthTokenKey } = require('../../systemServices/globalVariables')
const prisma = require("../../systemServices/prisma")

exports.ROUTE = '/api/favourites'

exports.PERMISSIONS = ['REQUIRECOOKIE', 'REQUIREUSER']

exports.GET = async (req, res) => {
    const user = await getUserBySessionCookie(req.cookies[mainAuthTokenKey] || null);

    if (req?.query?.includes) {
        const fav = await prisma.favourite.findUnique({
            where: {
                userid_postid: {
                    userid: user.id,
                    postid: req.query.includes
                }
            }
        })

        return res.status(200).json({ included: !!fav })
    } else {
        const page = req.query.p ? parseInt(req.query.p, 0) : 0;
        const take = req.query.t ? parseInt(req.query.t, 50) : 50;

        const favs = await prisma.favourite.findMany({
            skip: page * take,
            take,
            where: {
                userid: user.id
            }
        })

        return res.status(200).json({ favourites: favs.map(v=>v.postid) })
    }
}

exports.PUT = async (req, res) => {
    const user = await getUserBySessionCookie(req.cookies[mainAuthTokenKey] || null);

    if (!req?.body?.post && !req?.body?.posts) return res.status(400).send('No post provided in body')

    if (req.body.posts) {
        await prisma.favourite.createMany({
            data: req.body.posts.map(id => ({ userid: user.id, postid: id }))
        })

        return res.status(200).send('Updated user favs')
    } else {
        const result = await prisma.favourite.create({
            data: {
                userid: user.id,
                postid: req.body.post
            }
        })

        const favs = await prisma.favourite.count({
            where: {
                postid: req.body.post
            }
        })

        return res.status(200).json({ count: favs })
    }
}

exports.DELETE = async (req, res) => {
    const user = await getUserBySessionCookie(req.cookies[mainAuthTokenKey] || null);

    if (!req?.body?.post) return res.status(400).send('No post provided in body')

    const result = await prisma.favourite.delete({
        where: {
            userid_postid: {
                userid: user.id,
                postid: req.body.post
            }
        }
    })

    const favs = await prisma.favourite.count({
        where: {
            postid: req.body.post
        }
    })

    return res.status(200).json({ count: favs })
}