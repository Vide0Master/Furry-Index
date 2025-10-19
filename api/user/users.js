const getUserByID = require("../../systemServices/getUserByID");
const prisma = require("../../systemServices/prisma");

exports.ROUTE = "/api/users";

exports.GET = async (req, res) => {
    const page = req.query.p ? parseInt(req.query.p) : 0;
    const take = req.query.t ? parseInt(req.query.t) : 50;
    const tagFilter = req.query.tags
        ? req.query.tags.split(/[ +]+/).map(tag => tag.trim()).filter(Boolean)
        : [];

    if (req.query.count === "true") {
        const count = await prisma.user.count({});
        return res.status(200).json({ count });
    }

    const where = {};

    if (tagFilter.length > 0) {
        where.OR = tagFilter.map(tag => ({
            OR: [
                {
                    username: {
                        contains: tag,
                        mode: "insensitive"
                    }
                },
                {
                    visiblename: {
                        contains: tag,
                        mode: "insensitive"
                    }
                }
            ]
        }));
    }

    const users = await prisma.user.findMany({
        skip: page * take,
        take,
        select: {
            id: true
        },
        where
    });

    for (const usrIndex in users) {
        users[usrIndex] = await getUserByID(users[usrIndex].id, ["privateprofileparams"]);
    }

    res.status(200).json({ users });
};
