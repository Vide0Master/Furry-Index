const crypto = require('crypto')
const cmd = require('./cmdPretty.js')
const getUserBySessionCookie = require('./getUserBySessionCookie.js')
const ws = require('./webServer.js').wsServer

class WSController {
    static clients = {}

    static send(cID, event, data) {
        this.clients[cID].ws.send(JSON.stringify({ event, data }))
    }

    static broadcast(event, data, matchRoute) {
        if (matchRoute) {
            for (const clientID in this.clients) {
                if (this.clients[clientID].location == matchRoute)
                    this.send(clientID, event, data)
            }
        } else {
            for (const cID in this.clients) {
                this.send(cID, event, data)
            }
        }
    }

    static listeners = {}

    static registerListener(name, func) {
        if (this.listeners[name]) {
            cmd.warn(`Listener ${name} will not be added, as listener with same name is present`)
            return
        }

        this.listeners[name] = func
    }

    static processListener(name, data) {
        if (!this.listeners[name]) {
            cmd.bad(`Listener ${name} was not found`)
            return { err: 'NOLISTENER' }
        }

        this.listeners[name](data)
    }
}

ws.on('connection', (uws) => {
    const wsSessionId = crypto.randomUUID()
    WSController.clients[wsSessionId] = {
        ws: uws,
        location: '/'
    }

    uws.on('message', async (data) => {
        try {
            const requset = JSON.parse(data.toString())

            const processedReq = {}
            processedReq.user = await getUserBySessionCookie(requset.tData.sessionID)
            processedReq.data = requset.payload

            switch (requset.tData.action) {
                case 'updateRoute': WSController.clients[wsSessionId].location = processedReq.data.route; break;
                default: WSController.processListener(requset.tData.action, processedReq); break;
            }
        } catch (e) {
            cmd.err(`User request failed` + e, [cmd.preps.ws])
        }
    })
})

module.exports = WSController