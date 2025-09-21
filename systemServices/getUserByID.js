const roleController = require('../systemServices/userRoleControl')
const prisma = require('./prisma')

module.exports = async function getUserByID(id, exclude = []) {
    const userData = await prisma.user.findUnique({
        where: { id },
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
            globalprofileparams: true,
            roles: {
                select: {
                    id: true,
                    type: true,
                    specialData: true,
                    hidden: true
                }
            }
        }
    })

    if (userData) {
        for (const field of exclude) {
            delete userData[field]
        }

        for (const role of userData.roles) {
            if (roleController.roleTemplates[role.type].roleColor) role.roleColor = roleController.roleTemplates[role.type].roleColor
            if (roleController.roleTemplates[role.type].roleIcon) role.roleIcon = roleController.roleTemplates[role.type].roleIcon
            if (!exclude.includes('rolePermissions')) {
                role.permissions = roleController.roleTemplates[role.type].permissions
            }
        }

        return userData
    } else {
        return null
    }
}