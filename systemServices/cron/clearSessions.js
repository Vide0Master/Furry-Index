const cmd = require("../cmdPretty")
const prisma = require("../prisma")


async function checkExpiredSessions(params) {
    const killedExpiredSessions = await prisma.session.deleteMany({
        where: {
            AND: [
                {
                    expiresAt: {
                        lte: new Date()
                    }
                },
                {
                    expiresAt: {
                        not: null
                    }
                }
            ]
        }
    })

    cmd.info(`Cleared ${killedExpiredSessions.count} expired sessions`, [cmd.preps.System, { text: 'Sessions', color: 'yellow' }])
}

checkExpiredSessions()

module.exports = checkExpiredSessions