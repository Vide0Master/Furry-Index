const getUserBySessionCookie = require("../systemServices/getUserBySessionCookie")
const { mainAuthTokenKey } = require('../systemServices/globalVariables')
const keyControl = require('../systemServices/keyControl')

exports.ROUTE = '/api/key/:key'
exports.PERMISSIONS = ['REQUIRECOOKIE', 'REQUIREUSER']

const keyResponses = {
    "404": "Key not found",
    "405": "Key was already redeemed",
}

exports.POST = async (req, res) => {
    const user = await getUserBySessionCookie(req.cookies[mainAuthTokenKey] || null);

    const key = req.params.key

    if (!keyControl.verifyKey(key)) {
        return res.status(406).send("Key is malformed, key should be in format XXXXXX-XXXXXX-XXXXXX-XXXXXX")
    } else {
        const status = await keyControl.redeemKey(key, user.id)
        console.log(status)
        if (status.code == 200) {
            return res.status(200).json({ key: status.key })
        } else {
            return res.status(status).send(keyResponses[status.code])
        }
    }
}