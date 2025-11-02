const roleController = require("../systemServices/userRoleControl")
const prisma = require("./prisma")

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
                    visible: true
                }
            },
            email: true
        }
    })

    if (userData) {
        for (const field of exclude) {
            delete userData[field]
        }

        if (!exclude.includes("rolePermissions")) {
            if (!exclude.includes("rolePermissionsList")) {
                userData.permissionsList = []
            }

            for (const role of userData.roles) {
                if (roleController.roleTemplates[role.type].roleColor) role.roleColor = roleController.roleTemplates[role.type].roleColor
                if (roleController.roleTemplates[role.type].roleIcon) role.roleIcon = roleController.roleTemplates[role.type].roleIcon

                role.permissions = roleController.roleTemplates[role.type].permissions
                role.hiddable = roleController.roleTemplates[role.type].hiddable

                if (!exclude.includes("rolePermissionsList")) role.permissions.forEach(v => {
                    if (!userData.permissionsList.includes(v)) userData.permissionsList.push(v)
                })
            }
        }

        return userData
    } else {
        return null
    }
}