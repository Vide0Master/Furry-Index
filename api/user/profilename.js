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