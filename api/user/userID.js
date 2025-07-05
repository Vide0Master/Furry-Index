const getUserBySessionCookie = require("../../systemServices/getUserBySessionCookie")
const { mainAuthTokenKey } = require('../../systemServices/globalVariables')
const prisma = require('../../systemServices/prisma')

exports.ROUTE = '/api/profile/:userID'

exports.GET = async (req, res) => {
    const user = await getUserBySessionCookie(req.cookies[mainAuthTokenKey], ['privateparams'])

    if (!user) return res.status(404).send('User not found')

    res.status(200).json({ user })
}