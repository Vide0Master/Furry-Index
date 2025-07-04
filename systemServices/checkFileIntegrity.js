const cmd = require('./cmdPretty')
const prisma = require('./prisma')
const processFileStats = require('./processFileStats')

module.exports = async () => {
    const errorFiles = await prisma.file.findMany({
        where: {
            OR: [
                {
                    fileparams: {
                        equals: {},
                    },
                },
                {
                    tags: {
                        none: {}
                    }
                }
            ]
        },
        select: {
            id: true
        }
    })

    for (const file of errorFiles) {
        processFileStats(file.id)
    }
}