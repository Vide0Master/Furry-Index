const getUserBySessionCookie = require("../../systemServices/getUserBySessionCookie")
const { mainAuthTokenKey } = require('../../systemServices/globalVariables')
const prisma = require('../../systemServices/prisma')
const { ScoreType } = require('@prisma/client')

exports.ROUTE = '/api/post/:postID/score'

async function recalcPostScore(postID) {
    const scores = await prisma.score.findMany({
        where: { postID },
        select: { type: true }
    });
    let score = 0;
    for (const s of scores) {
        if (s.type === 'up') score++;
        else if (s.type === 'down') score--;
    }
    await prisma.post.update({
        where: { id: postID },
        data: { score }
    });
    return score;
}

exports.GET = async (req, res) => {
    const postID = req.params.postID;
    const post = await prisma.post.findUnique({
        where: { id: postID },
        select: { score: true }
    });
    if (!post) return res.status(404).send('No such post');

    const scoreData = { score: post.score };
    const user = await getUserBySessionCookie(req.cookies[mainAuthTokenKey] || null);
    if (user) {
        const userScore = await prisma.score.findUnique({
            where: {
                userid: user.id,
                postID: postID
            }
        });
        if (userScore) scoreData.userScore = userScore.type;
    }
    res.status(200).json(scoreData);
}

exports.POST = async (req, res) => {
    const user = await getUserBySessionCookie(req.cookies[mainAuthTokenKey] || null);
    if (!user) return res.status(401).send('You are not authorized');

    const postID = req.params.postID;
    const post = await prisma.post.findUnique({
        where: { id: postID },
        select: { score: true }
    });
    if (!post) return res.status(404).send('No such post');

    if (!req?.body?.type) return res.status(400).send('No type provided in body');
    if (!Object.values(ScoreType).includes(req.body.type)) return res.status(400).send('Incorrect type provided');

    const userScore = await prisma.score.upsert({
        where: {
            userid_postID: {
                userid: user.id,
                postID: postID,
            }
        },
        update: {
            type: req.body.type
        },
        create: {
            postID: postID,
            userid: user.id,
            type: req.body.type
        }
    });

    const newScore = await recalcPostScore(postID);

    return res.status(200).json({ state: userScore.type, score: newScore });
};

exports.DELETE = async (req, res) => {
    const postID = req.params.postID;
    const user = await getUserBySessionCookie(req.cookies[mainAuthTokenKey] || null);
    if (!user) return res.status(401).send('You are not authorized');

    const deleted = await prisma.score.deleteMany({
        where: {
            userid: user.id,
            postID: postID
        }
    });

    if (deleted.count == 0) res.status(500).send('Score removal failed');

    const newScore = await recalcPostScore(postID);

    return res.status(200).json({ state: 'none', score: newScore });
}