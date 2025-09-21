const getUserByID = require('./getUserByID')
const prisma = require('./prisma')


module.exports = async function getUserByUsername(username, exclude = []) {
    if (!username) return null

    const userData = await prisma.user.findUnique({
        where: { username },
        select: { id: true }
    })

    return await getUserByID(userData.id, exclude)
}