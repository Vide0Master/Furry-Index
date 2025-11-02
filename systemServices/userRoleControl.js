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
        permissions: []
    },
    supporter: {
        type: "supporter",
        roleIcon: "shield-bolt",
        roleColor: "#ffff00ff",
        manuallyAppendable: true,
        selfRemovable: true,
        selfAppendable: true,
        permissions: []
    },
    verifiedUser: {
        type: "verifiedUser",
        roleIcon: "shield-bolt",
        roleColor: "#2626cdff",
        manuallyAppendable: false,
        selfRemovable: false,
        selfAppendable: false,
        permissions: ["emailVerified"]
    },
    verifiedPaymentEntity: {
        type: "verifiedPaymentEntity",
        roleIcon: "shield-bolt",
        roleColor: "#4138e8ff",
        manuallyAppendable: true,
        selfRemovable: true,
        selfAppendable: true,
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
}

module.exports = roleController