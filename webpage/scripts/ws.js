const link = (location.protocol === "https:" ? "wss" : "ws") + `://${window.location.host}`;

function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
        const [key, value] = cookie.split("=");
        if (key === name) return decodeURIComponent(value);
    }
    return null;
}

class WSController {
    static ws = null;
    static reconnectTimeout = null;
    static pingInterval = null;
    static listeners = [];
    static reconnectDelay = 3000;
    static connectionAttempts = 0;

    static connect() {
        this.connectionAttempts++;

        if (this.ws) {
            try {
                this.ws.close();
            } catch { /* empty */ }
        }

        const ws = new WebSocket(link);
        this.ws = ws;

        ws.addEventListener("open", () => {
            this.updateRoute();
            this.startPing();
        });

        ws.addEventListener("close", () => {
            this.stopPing();
            this.scheduleReconnect();
        });

        ws.addEventListener("error", () => {
            ws.close();
        });

        ws.addEventListener("message", (e) => {
            try {
                const msg = JSON.parse(e.data);
                const cbs = this.listeners.filter(v => v.event === msg.event);
                cbs.forEach(v => v.cb(msg.data));
            } catch { /* empty */ }
        });
    }

    static scheduleReconnect() {
        if (this.reconnectTimeout) return;
        this.reconnectTimeout = setTimeout(() => {
            this.reconnectTimeout = null;
            this.connect();
        }, this.reconnectDelay);
    }

    static startPing() {
        this.stopPing();
        this.pingInterval = setInterval(() => {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.ws.send(JSON.stringify({ tData: { action: "ping" }, payload: {} }));
            }
        }, 30000);
    }

    static stopPing() {
        if (this.pingInterval) {
            clearInterval(this.pingInterval);
            this.pingInterval = null;
        }
    }

    static send(action, data) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

        const payload = {
            tData: {
                action,
                sessionID: getCookie("FURRYINDEXUSERTOKEN")
            },
            payload: data
        };

        try {
            this.ws.send(JSON.stringify(payload));
        } catch { /* empty */ }
    }

    static listen(event, cb, permanent) {
        this.listeners.push({ event, cb, permanent });
    }

    static updateRoute() {
        this.send("updateRoute", { route: location.pathname });
        this.listeners = this.listeners.filter(listener => listener.permanent);
    }
}

WSController.connect();

export default WSController;
