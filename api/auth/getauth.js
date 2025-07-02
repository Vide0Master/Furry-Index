const getUserBySessionCookie = require('../../systemServices/getUserBySessionCookie')
const { mainAuthTokenKey } = require('../../systemServices/globalVariables')
const prisma = require('../../systemServices/prisma')

exports.ROUTE = '/api/auth'

exports.PERMISSIONS = ['REQUIRECOOKIE']

exports.GET = async (req, res) => {
    const userToken = req.cookies[mainAuthTokenKey]
    const userData = await getUserBySessionCookie(userToken)
    
    if (!userData) return res.status(401).send('User not found by token')

    return res.status(200).json(userData)
}

exports.DELETE = async (req, res) => {
    const userToken = req.cookies[mainAuthTokenKey]

    const result = await prisma.session.delete({
        where: {
            token: userToken
        }
    })

    if (!result) return res.status(500).send('Error removing session token')

    return res.status(200).send('Removed session token')
}
