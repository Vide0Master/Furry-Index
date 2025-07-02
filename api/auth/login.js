const bcrypt = require('bcrypt')
const prisma = require("../../systemServices/prisma")
const cmd = require('../../systemServices/cmdPretty')
const { tempSessionTimeout, DEVmode, mainAuthTokenKey } = require('../../systemServices/globalVariables')
const loginDebugPreps = [cmd.preps.Debug, cmd.preps.API, { text: 'Login', color: 'green' }]

exports.ROUTE = '/api/login'

exports.POST = async (req, res) => {
    const { login, password, remember } = req.body

    if (!login || !password) return res.status(400).send('Login and password should be provided')

    if (DEVmode) cmd.info(`Initiating login procedure for "${login}"`, loginDebugPreps)

    const user = await prisma.user.findFirst({
        where: {
            username: login
        }
    })

    if (!user) {
        if (DEVmode) cmd.bad(`User "${login}" was not found`, loginDebugPreps)
        return res.status(404).send('User was not found')
    }

    const passCheck = await bcrypt.compare(password, user.password)

    if (!passCheck) {
        if (DEVmode) cmd.bad(`Password for user "${login}" is incorrect`, loginDebugPreps)
        return res.status(401).send('Wrong password')
    }

    if (DEVmode) cmd.info(`All good for user "${login}", creating session`, loginDebugPreps)

    const currentDate = new Date()
    const userToken = []
    userToken.push(await bcrypt.hash(`${currentDate.getTime()}`, 10))
    userToken.push(await bcrypt.hash(login, 10))
    if (DEVmode) userToken.push('DEVELOPMENT')
    const resultToken = userToken.join('#')

    /* 
        TOKEN STRUCTURE:

        HASH OF CREATION TIME
        HASH OF UESRNAME
        DEVELOPER MARK OF TOKEN

        SPLITTED WITH #
    */

    const expiresAt = currentDate
    if (!remember) {
        expiresAt.setHours(expiresAt.getHours() + tempSessionTimeout)
    }

    const dbresult = await prisma.session.create({
        data: {
            token: resultToken,
            userid: user.id,
            createdAt: currentDate,
            expiresAt: remember ? null : expiresAt,
            clientinfo: req.clientInfo
        }
    })

    if (!dbresult) {
        if (DEVmode) cmd.err(`Creation of session for "${login}" failed`, loginDebugPreps)
        return res.status(500).send('Session creation failed')
    }

    if (DEVmode) cmd.ok(`Session created for "${login}"`, loginDebugPreps)

    res.setHeader('Set-Cookie', `${mainAuthTokenKey}=${resultToken}; ${remember ? `Max-Age=${10 * 365 * 24 * 60 * 60}; ` : ''}Path=/; SameSite=Strict`);
    return res.status(200).send(`Here\`s your token, my friend, for FREE!`)
}
