const { updateFileLastActivity } = require("../../systemServices/DBFunctions")
const getUserBySessionCookie = require("../../systemServices/getUserBySessionCookie")
const { mainAuthTokenKey } = require('../../systemServices/globalVariables')
const prisma = require('../../systemServices/prisma')

exports.ROUTE = '/api/profile/:username'

exports.GET = async (req, res) => {
    const user = await prisma.user.findUnique({
        where: {
            username: req.params.username
        },
        select: {
            id: true,
            username: true,
            visiblename: true,
            avatar: true,
            createdAt: true,
            globalprofileparams: true,
        }
    })

    if (!user) return res.status(404).send('User not found')

    user.avatar = !!user.avatar

    res.status(200).json({ user })
}

exports.PUT = async (req, res) => {
    const sessionUser = await getUserBySessionCookie(req.cookies[mainAuthTokenKey])
    if (sessionUser.username !== req.params.username) return res.status(403).send('You are not authorized to modify this user')
    const varialbes = {
        visiblename: true,
        avatarID: true,
        globalprofileparams: true,
        privateprofileparams: true,
        password: true,
        id: false,
        username: false,
        createdAt: false
    }

    const data = req.body

    for (const datVar in data) {
        const check = varialbes[datVar]
        if (typeof check != 'boolean') return res.status(400).send(`Invalid variable [${datVar}]`)
        if (!check) return res.status(403).send(`Variable [${datVar}] is restricted to change`)
    }

    if (data.avatarID) updateFileLastActivity(data.avatarID)

    const updatedUser = await prisma.user.update({
        where: {
            id: sessionUser.id
        },
        data
    })

    return res.status(200).send('Profile updated successfully')
}

exports.DELETE = async (req, res) => {
    const sessionUser = await getUserBySessionCookie(req.cookies[mainAuthTokenKey])
    if (sessionUser.username !== req.params.username) return res.status(403).send('You are not authorized to modify this user')
    const varialbes = {
        visiblename: true,
        avatarID: true,
        globalprofileparams: false,
        privateprofileparams: false,
        password: false,
        id: false,
        username: false,
        createdAt: false
    }

    const data = req.body

    for (const datVar in data) {
        const check = varialbes[datVar]
        if (typeof check != 'boolean') return res.status(400).send(`Invalid variable [${datVar}]`)
        if (!check) return res.status(403).send(`Variable [${datVar}] is restricted to change`)
        data[datVar] ? data[datVar] = null : delete data[datVar]
    }

    if (data.avatarID == null) updateFileLastActivity(sessionUser.avatarID)

    const updatedUser = await prisma.user.update({
        where: {
            id: sessionUser.id
        },
        data
    })

    return res.status(200).send('Profile updated successfully')
}