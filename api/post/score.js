const getUserBySessionCookie = require("../../systemServices/getUserBySessionCookie")
const { mainAuthTokenKey } = require('../../systemServices/globalVariables')
const prisma = require('../../systemServices/prisma')
const { ScoreType } = require('@prisma/client')

exports.ROUTE = '/api/post/:postid/score'

async function recalcPostScore(postid) {
    const scores = await prisma.score.findMany({
        where: { postid },
        select: { type: true }
    });
    let score = 0;
    for (const s of scores) {
        if (s.type === 'up') score++;
        else if (s.type === 'down') score--;
    }
    await prisma.post.update({
        where: { id: postid },
        data: { score }
    });
    return score;
}

exports.GET = async (req, res) => {
    const postid = req.params.postid;
    const post = await prisma.post.findUnique({
        where: { id: postid },
        select: { score: true }
    });
    if (!post) return res.status(404).send('No such post');

    const scoreData = { score: post.score };
    const user = await getUserBySessionCookie(req.cookies[mainAuthTokenKey] || null);
    if (user) {
        const userScore = await prisma.score.findUnique({
            where: {
                userid: user.id,
                postid: postid
            }
        });
        if (userScore) scoreData.userScore = userScore.type;
    }
    res.status(200).json(scoreData);
}

exports.POST = async (req, res) => {
    const user = await getUserBySessionCookie(req.cookies[mainAuthTokenKey] || null);
    if (!user) return res.status(401).send('You are not authorized');

    const postid = req.params.postid;
    const post = await prisma.post.findUnique({
        where: { id: postid },
        select: { score: true }
    });
    if (!post) return res.status(404).send('No such post');

    if (!req?.body?.type) return res.status(400).send('No type provided in body');
    if (!Object.values(ScoreType).includes(req.body.type)) return res.status(400).send('Incorrect type provided');

    const userScore = await prisma.score.upsert({
        where: {
            userid_postid: {
                userid: user.id,
                postid: postid,
            }
        },
        update: {
            type: req.body.type
        },
        create: {
            postid: postid,
            userid: user.id,
            type: req.body.type
        }
    });

    const newScore = await recalcPostScore(postid);

    return res.status(200).json({ state: userScore.type, score: newScore });
};

exports.DELETE = async (req, res) => {
    const postid = req.params.postid;
    const user = await getUserBySessionCookie(req.cookies[mainAuthTokenKey] || null);
    if (!user) return res.status(401).send('You are not authorized');

    const deleted = await prisma.score.deleteMany({
        where: {
            userid: user.id,
            postid: postid
        }
    });

    if (deleted.count == 0) res.status(500).send('Score removal failed');

    const newScore = await recalcPostScore(postid);

    return res.status(200).json({ state: 'none', score: newScore });
}