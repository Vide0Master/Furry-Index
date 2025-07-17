const prisma = require("./prisma")

module.exports = class DBFunctions {
    static async updateFileLastActivity(id) {
        await prisma.file.update({
            where: { id: id },
            data: {
                updatedAt: new Date()
            }
        })
    }
}