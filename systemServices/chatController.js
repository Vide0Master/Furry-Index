const getUserByID = require("./getUserByID")
const prisma = require("./prisma")


module.exports = class ChatController {
    static async createChat(settings) {
        const chat = await prisma.chat.create({ data: { settings } })
        return chat
    }

    static async findChat(options) {
        const chat = await prisma.chat.findFirst({ where: options })
        return chat
    }

    static async createMessage(chatID, userID, text, specialData) {
        const msg = await prisma.chatMessage.create({
            data: {
                chatID,
                userID,
                text,
                specialData
            }
        })

        return msg
    }

    static async getChatMessages(chatID, page, take) {
        const chat = await prisma.chat.findUnique({
            where: {
                id: chatID
            },
            include: {
                chatMessages: {
                    orderBy: { sentAt: "desc" },
                    take, skip: page * take
                }
            }
        })

        if (!chat) return null

        for (const message of chat.chatMessages) {
            message.user = await getUserByID(message.userID, ["privateprofileparams", "email"])
        }

        return chat.chatMessages
    }

    static async removeChatMessage(msgID, userID, type = "user") {
        if (!["postOwner", "admin"].includes(type)) {
            const msg = await prisma.chatMessage.findUnique({
                where: {
                    id: msgID
                }
            })

            if (msg.userID != userID) return null
        }

        const msg = await this.updateMessage(msgID, userID, {
            deleted: type,
            text: ":)",
            specialData: null
        }, true)

        return msg
    }

    static async getChatMessagesOfPost(postID, page, take) {
        this.findChat()
        const chatID = await prisma.chat.findFirst({
            where: { settings: { path: ["postID"], equals: postID } },
            select: { id: true }
        })

        if (!chatID?.id) return null

        return await this.getChatMessages(chatID.id, page, take)
    }

    static async getChatMessageOfDM(usersID) {

    }

    static async updateMessage(msgID, userID, data, override = false) {
        if (!override) {
            const msgTest = await prisma.chatMessage.findUnique({
                where: { id: msgID },
                select: { userID: true }
            })
            if (msgTest.userID != userID) return null
        }

        const msg = await prisma.chatMessage.update({
            where: { id: msgID, userID },
            data
        })

        return msg
    }
}
