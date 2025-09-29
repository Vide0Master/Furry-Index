const getUserBySessionCookie = require("../systemServices/getUserBySessionCookie")
const { mainAuthTokenKey } = require("../systemServices/globalVariables")
const getUserByID = require("../systemServices/getUserByID");
const prisma = require("../systemServices/prisma");
const { testUserPermission } = require("../systemServices/userRoleControl");

exports.ROUTE = "/api/news"

exports.GET = async (req, res) => {
    const page = req.query.p ? parseInt(req.query.p) : 0;
    const take = req.query.t ? parseInt(req.query.t) : 10;

    const newsList = await prisma.newsLetter.findMany({
        skip: page * take,
        take,
    })

    for (const post of newsList) {
        post.author = await getUserByID(post.authorid, ["privateprofileparams"])
    }

    res.status(200).json({ news: newsList })
}

exports.POST = async (req, res) => {
    const user = await getUserBySessionCookie(req.cookies[mainAuthTokenKey] || null);

    if (!testUserPermission(user.id, "admin:news")) {
        return res.status(403).send("You dont have permission to post news.")
    }

    const newsData = req.body

    const allowedKeys = ["title", "description", "tags"]
    if (!Object.keys(newsData).every(key => allowedKeys.includes(key))) {
        return res.status(400).send("Leftover keys found.")
    }

    newsData.authorid = user.id

    const news = await prisma.newsLetter.create({
        data: newsData
    })

    res.status(200).send("Newsletter created")
}

exports.PUT = async (req, res) => {

}

exports.DELETE = async (req, res) => {

}