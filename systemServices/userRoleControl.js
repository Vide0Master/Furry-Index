const prisma = require("./prisma")

// ROLE PERMISSIONS LIST AND DESCRIPTION
// tbd :D

// 01.11.2025
// so, there is some progress and understanding of what goes where and what it does
// atm there is some forgotten frontend pieces of data

const roleTemplates = {
    superAdmin: {
        type: "superAdmin",
        roleIcon: "shield-bolt",
        roleColor: "#e5e838ff",
        hiddable: false,
        manuallyAppendable: false,
        selfRemovable: false,
        selfAppendable: false,
        permissions: [
            "admin:news",
            "admin:posts",
            "admin:reports",
            "admin:userRoles",
            "admin:rmMessages"
        ]
    },
    admin: {
        type: "admin",
        roleIcon: "shield",
        roleColor: "#e83838ff",
        hiddable: false,
        manuallyAppendable: true,
        selfRemovable: false,
        selfAppendable: false,
        permissions: [
            "admin:news",
            "admin:posts",
            "admin:reports",
            "admin:userRoles",
            "admin:rmMessages"
        ]
    },
    moderator: {
        type: "moderator",
        roleIcon: "shield",
        roleColor: "#ab32ccff",
        hiddable: false,
        manuallyAppendable: true,
        selfRemovable: false,
        selfAppendable: false,
        permissions: [
            "admin:posts",
            "admin:reports",
            "admin:rmMessages"
        ]
    },
    artist: {
        type: "artist",
        roleIcon: "paint-palette",
        roleColor: "#38cbe8ff",
        manuallyAppendable: true,
        selfRemovable: true,
        selfAppendable: true,
        hiddable: false,
        permissions: []
    },
    supporter: {
        type: "supporter",
        roleIcon: "shield-bolt",
        roleColor: "#ffff00ff",
        manuallyAppendable: true,
        selfRemovable: true,
        selfAppendable: true,
        hiddable: true,
        permissions: []
    },
    verifiedUser: {
        type: "verifiedUser",
        roleIcon: "shield-bolt",
        roleColor: "#2626cdff",
        manuallyAppendable: false,
        selfRemovable: false,
        selfAppendable: false,
        hiddable: false,
        visible: false,
        permissions: ["emailVerified"]
    },
    verifiedPaymentEntity: {
        type: "verifiedPaymentEntity",
        roleIcon: "shield-bolt",
        roleColor: "#4138e8ff",
        manuallyAppendable: true,
        selfRemovable: true,
        selfAppendable: true,
        hiddable: true,
        visible: false,
        permissions: []
    },
}

class roleController {
    static async assignRole(userid, role) {
        const roleDataDB = await prisma.role.findFirst({
            where: {
                userid,
                type: role
            }
        })

        const roleFromDb = this.getRole(role)

        if (!roleFromDb) {
            return
        }

        const roleData = {
            userid,
            type: role
        }

        if (typeof roleFromDb.visible === "boolean")
            roleData.visible = roleFromDb.visible

        if (!roleDataDB && roleData) {
            await prisma.role.create({ data: roleData })
        } else {
            await prisma.role.update({
                where: { id: roleDataDB?.id },
                data: roleData
            })
        }
    }

    static async removeRole(userid, role) {
        const cnt = await prisma.role.deleteMany({
            where: {
                userid,
                type: role
            }
        })

        return cnt.count > 0 ? true : null
    }

    static async testUserPermission(userid, permission) {
        const roles = await prisma.role.findMany({
            where: {
                userid
            }
        })

        for (const role of roles) {
            return roleTemplates[role.type].permissions.includes(permission)
        }
    }

    static getRole(name) {
        const requiredRole = roleTemplates[name]
        if (requiredRole) delete requiredRole.permissions
        return requiredRole ? requiredRole : null
    }

    static testRole(name) {
        return roleTemplates[name] ? true : false
    }

    static roleTemplates = roleTemplates

    static async switchRoleVisibility(userID, roleName, visible) {
        const role = await prisma.role.findFirst({
            where: {
                userid: userID,
                type: roleName
            }
        })

        if (!role) return null

        const roleupd = await prisma.role.update({
            where: {
                id: role.id
            },
            data: {
                visible: !visible
            }
        })

        return roleupd
    }
}

module.exports = roleController