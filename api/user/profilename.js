const { updateFileLastActivity } = require("../../systemServices/DBFunctions")
const getUserBySessionCookie = require("../../systemServices/getUserBySessionCookie")
const getUserByUsername = require("../../systemServices/getUserByUsername")
const { mainAuthTokenKey } = require("../../systemServices/globalVariables")
const prisma = require("../../systemServices/prisma")
const bcrypt = require("bcrypt");

exports.ROUTE = "/api/profile/:username"

exports.GetUserData = {
    m: "get",
    e: async (req, res) => {
        const user = await getUserByUsername(req.params.username, ["privateprofileparams", "email"])

        if (!user) return res.status(404).send("User not found")

        res.status(200).json({ user })
    }
}

exports.UpdateUserData = {
    m: "put",
    p: ["user"],
    i: ["user"],
    e: async (req, res) => {
        const sessionUser = req.inc.user
        if (sessionUser.username !== req.params.username) return res.status(403).send("You are forbidden to modify this user")
        const varialbes = {
            visiblename: true,
            avatarID: true,
            globalprofileparams: true,
            privateprofileparams: true,
            password: true,
            id: false,
            username: false,
            createdAt: false,
            email: true
        }

        const data = req.body

        for (const datVar in data) {
            const check = varialbes[datVar]
            if (typeof check != "boolean") return res.status(400).send(`Invalid variable [${datVar}]`)
            if (!check) return res.status(403).send(`Variable [${datVar}] is restricted to change`)
        }

        if (data.email) {
            const emailKey = await keyControl.createKey("verifyEmail", { userID: req.inc.user.id, email: data.email }, true)

            await mailer(
                [
                    "Furry Index Email verification",
                    `Hello, ${req.inc.user.visiblename || `@${req.inc.user.username}`}!\nYou tried to link this email address to your account.\nTo verify this, redeem key provided below`,
                    emailKey,
                    "If this action was not made by you, delete this letter"
                ],
                "Furry Index Email verification",
                req.body.email
            )

            return res.status(200).send("Check email")
        }

        if (data.avatarID) updateFileLastActivity(data.avatarID)

        if (data.password) data.password = await bcrypt.hash(data.password, 10)

        await prisma.user.update({
            where: {
                id: sessionUser.id
            },
            data
        })

        return res.status(200).send("Profile updated successfully")
    }
}

exports.ClearUserDat = {
    m: "delete",
    p: ["user"],
    i: ["user"],
    e: async (req, res) => {
        const sessionUser = req.inc.user
        if (sessionUser.username !== req.params.username) return res.status(403).send("You are not authorized to modify this user")
        const varialbes = {
            visiblename: true,
            avatarID: true,
            globalprofileparams: false,
            privateprofileparams: false,
            password: false,
            id: false,
            username: false,
            createdAt: false,
            email: true
        }

        const data = req.body

        for (const datVar in data) {
            const check = varialbes[datVar]
            if (typeof check != "boolean") return res.status(400).send(`Invalid variable [${datVar}]`)
            if (!check) return res.status(403).send(`Variable [${datVar}] is restricted to change`)
            data[datVar] ? data[datVar] = null : delete data[datVar]
        }

        if (data.email === null) {
            const emailKey = await keyControl.createKey("removeEmail", { userID: req.inc.user.id }, true)

            await mailer(
                [
                    "Furry Index Email removal",
                    `Hello, ${req.inc.user.visiblename || `@${req.inc.user.username}`}!\nYou tried unlink this email address from your account.\nTo verify this, redeem key provided below`,
                    emailKey,
                    "If this action was not made by you, delete this letter"
                ],
                "Furry Index Email removal",
                sessionUser.email
            )

            return res.status(200).send("Check email")
        }

        if (data.avatarID == null) updateFileLastActivity(sessionUser.avatarID)

        await prisma.user.update({
            where: {
                id: sessionUser.id
            },
            data
        })

        return res.status(200).send("Profile updated successfully")
    }
}

const keyControl = require("../../systemServices/keyControl")

const mailer = require("../../systemServices/mailer")
const getUserByID = require("../../systemServices/getUserByID")
const roleController = require("../../systemServices/userRoleControl")

exports.UpdateUserRole = {
    m: "put",
    r: "+/role",
    p: ["requser"],
    i: ["user"],
    e: async (req, res) => {
        const userReqr = req.inc.user
        const tgtUser = req.params.username === userReqr.username ? userReqr : await getUserByUsername(req.params.username)

        if (userReqr.id !== tgtUser.id && !userReqr.permissionsList.includes("admin:userRoles"))
            return res.status(403).send("Forbidden")

        const data = req.body

        if ((data.add || data.rm) && !userReqr.permissionsList.includes("admin:userRoles"))
            return res.status(403).send("Forbidden")

        let rslt = null
        switch (data.action) {
            case "remove": {
                rslt = await roleController.removeRole(tgtUser.id, data.role)
            }; break;
            case "add": {
                rslt = await roleController.assignRole(tgtUser.id, data.role)
            }; break;
        }

        if (rslt === null) return res.status(500).send("Internal server error")

        const user = await getUserByID(tgtUser.id)

        return res.status(200).json({ roles: user.roles })
    }
}
