const crypto = require("crypto");
const cmd = require("./cmdPretty.js");
const getUserBySessionCookie = require("./getUserBySessionCookie.js");
const ws = require("./webServer.js").wsServer;

class WSController {
    static clients = {};
    static listeners = {};

    static send(cID, event, data) {
        const client = this.clients[cID];
        if (client && client.ws.readyState === 1) {
            client.ws.send(JSON.stringify({ event, data }));
        }
    }

    static broadcast(event, data, matchRoute) {
        for (const cID in this.clients) {
            const client = this.clients[cID];
            if (!client) continue;
            if (matchRoute && client.location !== matchRoute) continue;
            this.send(cID, event, data);
        }
    }

    static registerListener(name, func) {
        if (this.listeners[name]) {
            cmd.warn(`Listener ${name} will not be added — already exists`);
            return;
        }
        this.listeners[name] = func;
    }

    static processListener(name, data) {
        const listener = this.listeners[name];
        if (!listener) {
            cmd.bad(`Listener ${name} was not found`);
            return { err: "NOLISTENER" };
        }
        listener(data);
    }

    static removeClient(id) {
        delete this.clients[id];
    }
}

ws.on("connection", (uws) => {
    const wsSessionId = crypto.randomUUID();
    WSController.clients[wsSessionId] = {
        ws: uws,
        location: "/"
    };

    uws.on("message", async (data) => {
        try {
            const request = JSON.parse(data.toString());
            if (request.tData.action === "ping") {
                // можно ответить pong, если нужно
                return;
            }

            const processedReq = {
                user: await getUserBySessionCookie(request.tData.sessionID),
                data: request.payload
            };

            switch (request.tData.action) {
                case "updateRoute":
                    WSController.clients[wsSessionId].location = processedReq.data.route;
                    break;
                default:
                    WSController.processListener(request.tData.action, processedReq);
                    break;
            }
        } catch (e) {
            cmd.err(`User request failed: ${e}`, [cmd.preps.ws]);
        }
    });

    uws.on("close", () => {
        WSController.removeClient(wsSessionId);
    });

    uws.on("error", (err) => {
        cmd.err(`WebSocket error: ${err}`, [cmd.preps.ws]);
        WSController.removeClient(wsSessionId);
    });
});

module.exports = WSController;
