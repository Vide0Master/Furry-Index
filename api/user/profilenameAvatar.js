const getUserBySessionCookie = require("../../systemServices/getUserBySessionCookie")
const { mainAuthTokenKey } = require('../../systemServices/globalVariables')
const prisma = require("../../systemServices/prisma")
const sendFileByName = require("../../systemServices/sendFileByName")

exports.ROUTE = '/api/profile/:userName/avatar'

exports.GET = async (req, res) => {
    const user = await prisma.user.findUnique({
        where: {
            username: req.params.userName
        },
        select: {
            avatar: {
                select: {
                    file: true
                }
            }
        }
    })

    if (!user) return res.status(404).send('User not found')

    if (!user.avatar) return res.status(404).send('Avatar not found')

    sendFileByName(res, user.avatar.file)
}

exports.PUT = async (req, res) => {
    const user = await getUserBySessionCookie(req.cookies[mainAuthTokenKey])

    const userIdByName = await prisma.user.findUnique({
        where: {
            username: req.params.userName
        },
        select: {
            id: true,
        }
    })

    if (user.id != userIdByName.id) return res.status(403).send('Forbidden to change someones avatar')

    const avatarID = req.body.id

    if (!avatarID) return res.status(400).send('No avatar ID provided')

    const useravatar = await prisma.user.updateMany({
        where: {
            id: user.id
        },
        data: { avatarID }
    })

    if (useravatar.count == 0) return res.status(500).send('Failed to update avatar')

    res.status(200).send('Avatar updated successfully')
}

exports.DELETE = async (req, res) => {
    const user = await getUserBySessionCookie(req.cookies[mainAuthTokenKey])

    const userIdByName = await prisma.user.findUnique({
        where: {
            username: req.params.userName
        },
        select: {
            id: true,
        }
    })

    if (user.id != userIdByName.id) return res.status(403).send('Forbidden to change someones avatar')

    const useravatar = await prisma.user.updateMany({
        where: {
            id: user.id
        },
        data: { avatarID: null }
    })

    if (useravatar.count == 0) return res.status(500).send('Failed to remove avatar')

    res.status(200).send('Avatar removed successfully')
}