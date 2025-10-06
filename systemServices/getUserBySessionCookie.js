const getUserByID = require("./getUserByID")
const prisma = require("./prisma")


module.exports = async function getUserBySessionCookie(cookie, exclude = []) {
    if (!cookie) return null

    const sessionData = await prisma.session.findUnique({
        where: { token: cookie }
    })

    if (!sessionData) return null

    return await getUserByID(sessionData.userid, exclude)
}