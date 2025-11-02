const prisma = require("./prisma");
const crypto = require("crypto")
const roleControl = require("./userRoleControl")
const bcrypt = require("bcrypt");
const sendMail = require("./mailer");

function generateKey() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const length = 6;
    const parts = 4;

    function getRandomChar() {
        const array = new Uint32Array(1);
        crypto.getRandomValues(array);
        return chars[array[0] % chars.length];
    }

    function getPart() {
        return Array.from({ length }, getRandomChar).join("");
    }

    return Array.from({ length: parts }, getPart).join("-");
}

class KeyController {
    static async createKey(type, data = {}, rewrite = false) {
        if (rewrite) {
            const existing = await prisma.reddemableKey.findFirst({
                where: { type, data: { equals: data } }
            });

            if (existing) {
                const key = await prisma.reddemableKey.update({
                    where: { key: existing.key },
                    data: {
                        key: generateKey(),
                        redeemed: false,
                        data
                    }
                });
                return key.key
            } else {
                const key = await prisma.reddemableKey.create({
                    data: {
                        key: generateKey(),
                        type,
                        redeemed: false,
                        data
                    }
                });
                return key.key
            }
        } else {
            const key = await prisma.reddemableKey.create({
                data: {
                    key: generateKey(),
                    type,
                    redeemed: false,
                    data
                }
            });
            return key.key
        }
    }

    static async redeemKey(key, userid) {
        const keyData = await prisma.reddemableKey.findUnique({
            where: { key }
        })

        if (!keyData) {
            return { code: 404 }
        }

        if (keyData.redeemed) {
            return { code: 405 }
        }

        switch (keyData.type) {
            case "superadminassign": {
                if (!userid) return { code: 403 }
                roleControl.assignRole(userid, "superAdmin")
            }; break;
            case "verifyEmail": {
                await prisma.user.update({
                    where: {
                        id: keyData.data.userID,
                    },
                    data: {
                        email: keyData.data.email
                    }
                })
            }; break;
            case "removeEmail": {
                await prisma.user.update({
                    where: {
                        id: keyData.data.userID,
                    },
                    data: {
                        email: null
                    }
                })
            }; break;
            case "passwordReset": {
                const newPass = generateKey()

                await prisma.user.update({
                    where: {
                        id: keyData.data.userID
                    },
                    data: {
                        password: await bcrypt.hash(newPass, 10)
                    }
                })

                await prisma.session.deleteMany({
                    where: {
                        userid: keyData.data.userID
                    }
                })

                await sendMail(
                    [
                        "Furry index new password notification",
                        "Hello, your password was successfully reset, use this password to enter into your account.",
                        newPass,
                        "This action automatically clears all user sessions.",
                        "If this action was not made by you, enter your account with this password and reset it in settings"
                    ],
                    "Furry index new password notification",
                    keyData.data.email
                )
            }; break;
        }

        await prisma.reddemableKey.update({
            where: {
                key: key
            },
            data: {
                redeemed: true
            }
        })

        keyData.redeemed = true

        return { code: 200, key: keyData }
    }

    static verifyKey(key) {
        const regex = /^[A-Z0-9]{6}(?:-[A-Z0-9]{6}){3}$/;
        return regex.test(key)
    }
}

module.exports = KeyController