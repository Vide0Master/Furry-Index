const getUserByID = require("../../systemServices/getUserByID");
const KeyController = require("../../systemServices/keyControl");
const sendMail = require("../../systemServices/mailer");
const prisma = require("../../systemServices/prisma");

exports.ROUTE = "/api/users";

exports.GetUsers = {
    m: "get",
    e: async (req, res) => {
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
            users[usrIndex] = await getUserByID(users[usrIndex].id, ["privateprofileparams", "email"]);
        }

        res.status(200).json({ users });
    }
}

exports.PWDReset = {
    m: "post",
    r: "/api/users/password-reset",
    e: async (req, res) => {
        const email = req.body.email

        if (!email) return res.status(400).send("No user email provided")

        const userByEmail = await prisma.user.findFirst({
            where: {
                email: email
            },
            select: {
                id: true
            }
        })

        if (!userByEmail) return res.status(404).send("User was not found")

        const user = await getUserByID(userByEmail.id)

        const pwdResetKey = await KeyController.createKey("passwordReset", { userID: user.id, email: email }, true)

        await sendMail(
            [
                "Furry Index password reset",
                `Hello, ${user.visiblename || `@${user.username}`}\nYou requested password reset for your account.\nRedeem this key to reset your password and get new password.`,
                pwdResetKey,
                "If this action was not made by you, delete this letter"
            ],
            "Furry Index password reset",
            email
        )

        return res.status(200).send("Check email")
    }
}
