const prisma = require('./prisma')

module.exports = async function getUserBySessionCookie(cookie) {
    if(!cookie) return null

    const userData = await prisma.session.findUnique({
        where: { token: cookie },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    visiblename: true,
                }
            }
        }
    })

    if (userData?.user) {
        return userData.user
    } else {
        return null
    }
}