const prisma = require('./prisma')

module.exports = async function getUserBySessionCookie(cookie, exclude = []) {
    if (!cookie) return null

    const userData = await prisma.session.findUnique({
        where: { token: cookie },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    visiblename: true,
                    avatar: {
                        select: {
                            file: true
                        }
                    },
                    avatarID: true,
                    createdAt: true,
                    privateprofileparams: true,
                    globalprofileparams: true
                }
            }
        }
    })

    if (userData?.user) {
        for (const field of exclude) {
            delete userData.user[field]
        }
        return userData.user
    } else {
        return null
    }
}