const getUserBySessionCookie = require("../../systemServices/getUserBySessionCookie")
const { mainAuthTokenKey } = require("../../systemServices/globalVariables")
const prisma = require("../../systemServices/prisma")

exports.ROUTE = "/api/files"

exports.PERMISSIONS = ["REQUIRECOOKIE", "REQUIREUSER"]


// little fun notation
// this script should be IDENTICAL to post search
// main case is that this uses tags to search
// imagine what
// it's not the same
// mainly based of unique query parameter (inuse)
// some day i will rework this

// but fuck it, it works, i dont need to touch it, until some day...

exports.GetFiles = {
    method: "get",
    exec: async (req, res) => {
        const userToken = req.cookies[mainAuthTokenKey]
        const user = await getUserBySessionCookie(userToken)

        const page = req.query.p ? parseInt(req.query.p) : 0
        const take = req.query.t ? parseInt(req.query.t) : 50
        const tagFilter = req.query.tags //shit down here hit hard
            ? req.query.tags.split(/[ +]+/).map(tag => tag.trim()).filter(Boolean)
            : []

        const positiveTagNames = []
        const negativeTagNames = []

        for (let rawTag of tagFilter) {
            if (rawTag.startsWith("-")) {
                negativeTagNames.push(rawTag.slice(1))
            } else {
                positiveTagNames.push(rawTag)
            }
        }

        const tagFilters = []

        if (positiveTagNames.length > 0) {
            tagFilters.push({
                AND: positiveTagNames.map(v => ({ tags: { some: { name: v } } }))
            })
        }

        if (negativeTagNames.length > 0) {
            tagFilters.push({
                NOT: {
                    tags: {
                        some: { name: { in: negativeTagNames } }
                    }
                }
            })
        }

        const inUse = req.query.inuse
        let postFilter
        if (inUse === "false") {
            postFilter = { post: null, avatarfor: null }
        } else if (inUse?.startsWith("postID:")) {
            const postID = inUse.split(":", 2)[1]
            postFilter = {
                OR: [{ post: { id: postID } }, { post: null }],
                avatarfor: null
            }
        } else if (inUse?.startsWith("avatarID")) {
            postFilter = {
                OR: [{ avatarfor: { id: user.id } }, { avatarfor: null }],
                post: null
            }
        } else {
            postFilter = {}
        }

        const delay = new Date()
        delay.setDate(delay.getDate() - 1)

        const where = {
            OR: [
                { post: { isNot: null } },
                { avatarfor: { isNot: null } },
                { updatedAt: { gte: delay } }
            ],
            AND: [
                { ownerid: user.id },
                postFilter,
                ...tagFilters
            ]
        }

        const userFiles = await prisma.file.findMany({
            skip: page * take,
            take,
            where,
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                filetype: true,
                fileparams: true,
                createdAt: true,
                updatedAt: true,
                tags: {
                    orderBy: { name: "asc" },
                    select: {
                        name: true,
                        icon: true,
                        group: { select: { basename: true, color: true, name: true } }
                    }
                },
                post: true,
                avatarfor: { select: { username: true } },
            }
        })

        if (req.query.count === "true") {
            const count = await prisma.file.count({ where })
            return res.status(200).json({ files: userFiles, count })
        }

        for (const file of userFiles) {
            if (!file.avatarfor && !file.post) {
                const date = new Date(file.updatedAt)
                date.setDate(date.getDate() + 1)
                file.eraseOn = date.toISOString()
            }
        }

        return res.status(200).json({ files: userFiles })
    }
}