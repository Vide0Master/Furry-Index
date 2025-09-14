const prisma = require("./prisma")

// ROLE PERMISSIONS LIST AND DESCRIPTION
// tbd :D

const roleTemplates = {
    superAdmin: {
        type: "superAdmin",
        roleIcon: "shield-bolt",
        roleColor: "#e5e838ff",
        hiddable: false,
        permissions: []
    },
    admin: {
        type: "admin",
        roleIcon: "shield",
        roleColor: "#e83838ff",
        hiddable: false,
        permissions: []
    },
    moderator: {
        type: "moderator",
        roleIcon: "shield",
        roleColor: "#ab32ccff",
        hiddable: false,
        permissions: []
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
        roleColor: "#35e160ff",
        hiddable: false,
        permissions: []
    },
    verifiedPaymentEntity: {
        type: "verifiedPaymentEntity",
        roleIcon: "shield-bolt",
        roleColor: "#4138e8ff",
        hiddable: false,
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

        const newData = await prisma.role.upsert({
            where: {
                id: roleDataDB?.id,
                userid
            },
            create: {

            },
            update: {

            }
        })
    }

    static async removeRole(userid, role) {

    }

    static testUserPermission(userid, permission) {

    }

    static getRole(name) {
        const requiredRole = roleTemplates[name]
        return requiredRole ? requiredRole : null
    }
}

module.exports = roleController