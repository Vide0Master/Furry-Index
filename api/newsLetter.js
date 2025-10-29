const getUserBySessionCookie = require("../systemServices/getUserBySessionCookie")
const { mainAuthTokenKey } = require("../systemServices/globalVariables")
const getUserByID = require("../systemServices/getUserByID");
const prisma = require("../systemServices/prisma");
const { testUserPermission } = require("../systemServices/userRoleControl");

exports.ROUTE = "/api/news"

exports.GetNews = {
    m: "get",
    e: async (req, res) => {
        const page = req.query.p ? parseInt(req.query.p) : 0;
        const take = req.query.t ? parseInt(req.query.t) : 10;
        const count = req.query.count

        if (!count) {
            const newsList = await prisma.newsLetter.findMany({
                skip: page * take,
                take,
                orderBy: {
                    postedAt: "desc"
                }
            })

            for (const post of newsList) {
                post.author = await getUserByID(post.authorid, ["privateprofileparams", "email"])
            }

            res.status(200).json({ news: newsList })
        } else {
            const count = await prisma.newsLetter.count({})
            res.status(200).json({ count })
        }
    }
}

exports.CreateNews = {
    m: "get",
    e: async (req, res) => {
        const user = await getUserBySessionCookie(req.cookies[mainAuthTokenKey] || null);

        if (!testUserPermission(user.id, "admin:news")) {
            return res.status(403).send("You dont have permission to post news.")
        }

        const newsData = req.body

        if (!newsData) {
            return res.status(400).send("No request body provided")
        }

        const allowedKeys = ["title", "description", "tags"]
        if (!Object.keys(newsData).every(key => allowedKeys.includes(key))) {
            return res.status(400).send("Leftover keys found.")
        }

        newsData.authorid = user.id

        const news = await prisma.newsLetter.create({
            data: newsData
        })

        if (news) {
            res.status(200).send("Newsletter created")
        } else {
            res.status(500).send("Internal server error")
        }
    }
}

exports.UpdateNews = {
    m: "put",
    e: async (req, res) => {
        const user = await getUserBySessionCookie(req.cookies[mainAuthTokenKey] || null);
        if (!testUserPermission(user.id, "admin:news")) {
            return res.status(403).send("You dont have permission to edit news.")
        }

        const id = req.query.id
        if (!id) {
            res.status(400).send("No \"id\" in query provided")
        }

        const newsData = req.body
        if (!newsData) {
            return res.status(400).send("No request body provided")
        }

        const allowedKeys = ["title", "description", "tags"]
        if (!Object.keys(newsData).every(key => allowedKeys.includes(key))) {
            return res.status(400).send("Leftover or restricted keys found.")
        }

        await prisma.newsLetter.update({
            where: { id },
            data: newsData
        })

        res.status(200).send("Edited")
    }
}

exports.DeleteNews = {
    m: "delete",
    e: async (req, res) => {
        const user = await getUserBySessionCookie(req.cookies[mainAuthTokenKey] || null);
        if (!testUserPermission(user.id, "admin:news")) {
            return res.status(403).send("You dont have permission to delete news.")
        }

        const id = req.query.id
        if (!id) {
            res.status(400).send("No \"id\" in query provided")
        }

        const rm = await prisma.newsLetter.deleteMany({ where: { id } })

        if (rm.count > 0) {
            res.status(200).send("Message deleted")
        } else {
            res.status(400).send("Message was not found")
        }
    }
}