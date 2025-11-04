const getUserBySessionCookie = require("../../systemServices/getUserBySessionCookie")
const { mainAuthTokenKey } = require("../../systemServices/globalVariables")
const prisma = require("../../systemServices/prisma")

exports.ROUTE = "/api/files"

exports.PERMISSIONS = ["REQCOOKIE", "REQUSER"]


// little fun notation
// this script should be IDENTICAL to post search
// main case is that this uses tags to search
// imagine what
// it's not the same
// mainly based of unique query parameter (inuse)
// some day i will rework this

// but fuck it, it works, i dont need to touch it, until some day...

// 04.11.2025 - it's rework time boyyys

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

        const filterHandlers = {
            "id": (value, negative) => {
                const clause = { OR: value.split(",").map(v => ({ id: v })) };
                return negative ? { NOT: clause } : clause;
            },
            "usedByPost": (value, negative) => {
                const clause = { postid: value };
                return negative ? { NOT: clause } : clause;
            },
            "notUsed": (value, negative) => {
                const clause = { postid: null, avatarfor: null };
                return negative ? { NOT: clause } : clause;
            },
            "isAvatar": (value, negative) => {
                const clause = { avatarfor: value };
                return negative ? { NOT: clause } : clause;
            }
        };

        const positiveTagNames = []
        const negativeTagNames = []
        const processedFilters = []

        for (let rawTag of tagFilter) {
            let negative = false;
            let tag = rawTag;

            if (tag.startsWith("-")) {
                negative = true;
                tag = tag.slice(1);
            }

            const fieldMatch = tag.match(/^([a-zA-Z]+):(.+)$/);
            if (fieldMatch) {
                const [, field, value] = fieldMatch;
                if (filterHandlers[field]) {
                    const clause = filterHandlers[field](value, negative)
                    if (clause) processedFilters.push(clause);
                }
                continue;
            }

            if (negative) {
                negativeTagNames.push(tag);
            } else {
                positiveTagNames.push(tag);
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
                ...tagFilters,
                ...processedFilters
            ]
        }

        const orderBy = {}
        if (tagFilter.some(v => v.startsWith("usedByPost"))) {
            orderBy.postOrder = "asc"
        } else {
            orderBy.createdAt = "desc"
        }

        const userFiles = await prisma.file.findMany({
            skip: page * take,
            take,
            where,
            orderBy,
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