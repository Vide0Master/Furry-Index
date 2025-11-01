
const ChatController = require("../../../systemServices/chatController")
const getUserByID = require("../../../systemServices/getUserByID")
const prisma = require("../../../systemServices/prisma")
const WSController = require("../../../systemServices/WebSocket")

exports.ROUTE = "/api/posts/:postID/messages"

exports.GetPostMessages = {
    m: "get",
    e: async (req, res) => {
        const page = req.query.p ? parseInt(req.query.p) : 0;
        const take = req.query.t ? parseInt(req.query.t) : 20;

        const messages = await ChatController.getChatMessagesOfPost(req.params.postID, page, take)

        if (!messages) return res.status(404).send("No messages")

        res.status(200).json({ messages })
    }
}

exports.CreateMessage = {
    m: "post",
    p: ["USER"],
    i: ["USER"],
    e: async (req, res) => {
        const user = req.inc.user
        if (!user) return res.status(403).send("You are not authorized")

        let chat = await ChatController.findChat({ settings: { path: ["postID"], equals: req.params.postID } })
        if (!chat) chat = await ChatController.createChat({ postID: req.params.postID })

        const msg = await ChatController.createMessage(chat.id, user.id, req.body.text, req.body.specialData)
        msg.user = await getUserByID(msg.userID, ["privateprofileparams", "email"])

        if (msg) {
            res.status(200).send()
            WSController.broadcast("newMessage", { message: msg }, `/post/${req.params.postID}`)
        } else {
            res.status(500).send()
        }
    }
}

exports.UpdateMessage = {
    m: "put",
    p: ["USER"],
    i: ["USER"],
    e: async (req, res) => {
        const upd = await ChatController.updateMessage(req.body.msgID, req.inc.user.id, { text: req.body.newText })

        if (upd) {
            res.status(200).send()

            WSController.broadcast(`messageUpdate-${req.body.msgID}`, { newText: req.body.newText, action: "edit" }, `/post/${req.params.postID}`)
        } else {
            res.status(500).send()
        }
    }
}

exports.DeleteMessage = {
    m: "delete",
    p: ["USER"],
    i: ["USER"],
    e: async (req, res) => {
        const user = req.inc.user

        const postData = await prisma.post.findUnique({
            where: { id: req.params.postID }
        })

        const msgData = await prisma.chatMessage.findUnique({
            where: { id: req.body.msgID }
        })

        let rmtype = undefined

        if (user.permissionsList.includes("admin:rmMessages")) rmtype = "admin"
        if (user.id === postData.ownerid) rmtype = "postOwner"

        const rmrslt = await ChatController.removeChatMessage(req.body.msgID, user.id, rmtype)

        if (rmrslt) {
            res.status(200).send()

            WSController.broadcast(`messageUpdate-${req.body.msgID}`, { action: "delete", deleter: rmrslt.deleted }, `/post/${req.params.postID}`)
        } else {
            res.status(500).send()
        }
    }
}