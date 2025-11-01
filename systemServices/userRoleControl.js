const prisma = require("./prisma")

// ROLE PERMISSIONS LIST AND DESCRIPTION
// tbd :D

const roleTemplates = {
    superAdmin: {
        type: "superAdmin",
        roleIcon: "shield-bolt",
        roleColor: "#e5e838ff",
        hiddable: false,
        permissions: [
            "admin:news",
            "admin:posts",
            "admin:reports",
            "admin:users",
            "admin:rmMessages"
        ]
    },
    admin: {
        type: "admin",
        roleIcon: "shield",
        roleColor: "#e83838ff",
        hiddable: false,
        permissions: [
            "admin:news",
            "admin:posts",
            "admin:reports",
            "admin:users",
            "admin:rmMessages"
        ]
    },
    moderator: {
        type: "moderator",
        roleIcon: "shield",
        roleColor: "#ab32ccff",
        hiddable: false,
        permissions: [
            "admin:posts",
            "admin:reports",
            "admin:rmMessages"
        ]
    },
    artist: {
        type: "artist",
        roleIcon: "paint-palette",
        roleColor: "#e8e538ff",
        hiddable: false,
        permissions: []
    },
    supporter: {
        type: "supporter",
        roleIcon: "shield-bolt",
        roleColor: "#ffff00ff",
        hiddable: true,
        permissions: []
    },
    verifiedUser: {
        type: "verifiedUser",
        roleIcon: "shield-bolt",
        roleColor: "#2626cdff",
        hiddable: false,
        permissions: []
    },
    verifiedPaymentEntity: {
        type: "verifiedPaymentEntity",
        roleIcon: "shield-bolt",
        roleColor: "#4138e8ff",
        hiddable: true,
        hidden: true,
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

        const isRolePresent = this.testRole(role)

        if (!isRolePresent) {
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
        await prisma.role.delete({
            where: {
                userid,
                type: role
            }
        })
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