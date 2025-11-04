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

            const tempRoles = []

            for (const roleName in roleController.roleTemplates) {
                const role = roleController.roleTemplates[roleName]
                if (!userData.roles.some(v => v.type == role.type)) continue

                tempRoles.push(role)

                if (!exclude.includes("rolePermissionsList") && role?.permissions) {
                    role.permissions.forEach(v => {
                        if (!userData.permissionsList.includes(v)) {
                            userData.permissionsList.push(v)
                        }
                    })
                }
            }

            userData.roles = tempRoles
        }

        return userData
    } else {
        return null
    }
}