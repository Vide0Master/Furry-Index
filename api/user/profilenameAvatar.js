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
