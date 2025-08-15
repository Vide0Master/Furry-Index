
const getUserBySessionCookie = require("../../../systemServices/getUserBySessionCookie")
const { mainAuthTokenKey } = require('../../../systemServices/globalVariables')
const prisma = require("../../../systemServices/prisma")
const WSController = require("../../../systemServices/WebSocket")

exports.ROUTE = '/api/posts/:postID/messages'

exports.GET = async (req, res) => {
    const page = req.query.p ? parseInt(req.query.p) : 0;
    const take = req.query.t ? parseInt(req.query.t) : 20;

    const chatData = await prisma.chat.findFirst({
        where: {
            postID: req.params.postID
        },
        include: {
            chatMessages: {
                include: {
                    user: {
                        select: {
                            id: true,
                            avatarID: true,
                            username: true,
                            visiblename: true
                        }
                    }
                },
                orderBy: {
                    sentAt: 'desc'
                },
                take,
                skip: page * take
            }
        }
    })

    res.status(200).json({ chat: chatData })
}

exports.POST = async (req, res) => {
    const user = await getUserBySessionCookie(req.cookies[mainAuthTokenKey] || null);

    const chat = await prisma.chat.upsert({
        where: {
            postID: req.params.postID,
            linkType: 'post'
        },
        update: {},
        create: {
            postID: req.params.postID,
            linkType: 'post'
        }
    })

    const msg = await prisma.chatMessage.create({
        data: {
            chatID: chat.id,
            userID: user.id,
            text: req.body.text,
            specialData: req.body.specialData
        },
        include: {
            user: {
                select: {
                    id: true,
                    avatarID: true,
                    username: true,
                    visiblename: true
                }
            }
        }
    })

    if (msg) {
        res.status(200).send()

        WSController.broadcast('newMessage', { message: msg }, `/post/${req.params.postID}`)
    } else {
        res.status(500).send()
    }
}

exports.PUT = async (req, res) => {
    const user = await getUserBySessionCookie(req.cookies[mainAuthTokenKey] || null);

    const msg = await prisma.chatMessage.findUnique({
        where: {
            id: req.body.msgID
        }
    })

    if (msg.userID != user.id) return res.status(403).send(`You can't change message of another user`)

    const upd = await prisma.chatMessage.update({
        where: {
            id: req.body.msgID
        },
        data: {
            text: req.body.newText
        }
    })

    if (upd) {
        res.status(200).send()

        WSController.broadcast(`messageUpdate-${req.body.msgID}`, { newText: req.body.newText, action: 'edit' }, `/post/${req.params.postID}`)
    } else {
        res.status(500).send()
    }
}

exports.DELETE = async (req, res) => {
    const user = await getUserBySessionCookie(req.cookies[mainAuthTokenKey] || null);

    const msg = await prisma.chatMessage.findUnique({
        where: {
            id: req.body.msgID
        }
    })

    if (msg.userID != user.id) return res.status(403).send(`You can't delete message of another user`)

    const rmrslt = await prisma.chatMessage.delete({
        where: {
            id: req.body.msgID
        }
    })

    if (rmrslt) {
        res.status(200).send()

        WSController.broadcast(`messageUpdate-${req.body.msgID}`, { action: 'delete' }, `/post/${req.params.postID}`)
    } else {
        res.status(500).send()
    }
}