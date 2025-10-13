const link = (location.protocol === "https:" ? "wss" : "ws") + `://${window.location.host}`;

let ws = createWebSocket();

function createWebSocket() {
    const socket = new WebSocket(link);
    setupWsHandlers(socket);
    return socket;
}

function setupWsHandlers(socket) {
    socket.addEventListener("open", () => {
        if (WSController.isReconnecting) {
            WSController.isReconnecting = false;
            if (WSController.waitingAlert) WSController.waitingAlert.removeAlert();
        }

        WSController.updateRoute();
    });

    socket.addEventListener("message", (e) => {
        try {
            const msg = JSON.parse(e.data);
            const cbs = WSController.listeners.filter(v => v.event === msg.event);
            cbs.forEach(v => v.cb(msg.data));
        } catch (err) {
            console.error("Error processing message:", err);
        }
    });

    socket.addEventListener("close", () => {
        attemptReconnect();
    });

    socket.addEventListener("error", () => {
        socket.close();
    });
}

function attemptReconnect() {
    if (WSController.isReconnecting) return;
    WSController.isReconnecting = true;

    const tryReconnect = () => {
        let newWs;

        try {
            newWs = new WebSocket(link);
        } catch {
            return setTimeout(tryReconnect, 1000);
        }

        newWs.addEventListener("open", () => {
            ws = newWs;
            WSController.isReconnecting = false;
            WSController.updateRoute();
            setupWsHandlers(ws);
        });

        newWs.addEventListener("error", () => {
            newWs.close();
        });

        newWs.addEventListener("close", () => {
            if (WSController.isReconnecting) {
                setTimeout(tryReconnect, 1000);
            }
        });
    };

    tryReconnect();
}

function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
        const [key, value] = cookie.split("=");
        if (key === name) return decodeURIComponent(value);
    }
    return null;
}

class WSController {
    static listeners = [];
    static isReconnecting = false;

    static send(action, data) {
        if (!ws || ws.readyState !== WebSocket.OPEN) {
            return;
        }
        ws.send(JSON.stringify({
            tData: {
                action,
                sessionID: getCookie("FURRYINDEXUSERTOKEN"),
            },
            payload: data,
        }));
    }

    static listen(event, cb, permanent) {
        this.listeners.push({ event, cb, permanent });
    }

    static updateRoute() {
        this.send("updateRoute", { route: location.pathname });
        this.listeners = this.listeners.filter(listener => listener.permanent);
    }
}

export default WSController;
