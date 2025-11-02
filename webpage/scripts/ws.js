import AppInfo from "./appinfo.js";

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

    static _shouldLog() {
        return !!(AppInfo && AppInfo.appData && (AppInfo.appData.isDev || AppInfo.appData.isEval));
    }

    static _getStyles(statusColor = "#2196f3") {
        const styleLabel = [
            "background: #333",
            "color: #fff",
            "padding: 2px 6px",
            "margin: 4px",
            "border-radius: 50px",
            "font-weight: bold"
        ].join(";");

        const styleMethod = [
            `background: ${statusColor}`,
            "color: #fff",
            "padding: 2px 6px",
            "margin: 4px",
            "border-radius: 50px",
            "font-weight: bold"
        ].join(";");

        const styleRoute = [
            "background: #2196f3",
            "color: #fff",
            "padding: 2px 6px",
            "margin: 4px",
            "border-radius: 50px",
            "font-weight: bold"
        ].join(";");

        return { styleLabel, styleMethod, styleRoute };
    }

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

            if (this._shouldLog()) {
                const { styleLabel, styleMethod, styleRoute } = this._getStyles("#4caf50");
                console.groupCollapsed("%cWS%cOPEN%c" + link, styleLabel, styleMethod, styleRoute);
                console.log("Connection opened. Attempts:", this.connectionAttempts);
                console.groupEnd();
            }
        });

        ws.addEventListener("close", (ev) => {
            this.stopPing();
            this.scheduleReconnect();

            if (this._shouldLog()) {
                const { styleLabel, styleMethod, styleRoute } = this._getStyles("#000000");
                console.groupCollapsed("%cWS%cCLOSE%c" + link, styleLabel, styleMethod, styleRoute);
                console.log("Close event:", ev);
                console.groupEnd();
            }
        });

        ws.addEventListener("error", (err) => {
            // close will be triggered; keep error log minimal
            if (this._shouldLog()) {
                const { styleLabel, styleMethod, styleRoute } = this._getStyles("#000000");
                console.groupCollapsed("%cWS%cERROR%c" + link, styleLabel, styleMethod, styleRoute);
                console.log("WebSocket error:", err);
                console.groupEnd();
            }
            try { ws.close(); } catch { /* empty */ }
        });

        ws.addEventListener("message", (e) => {
            if (!this._shouldLog()) {
                // normal fast path
                try {
                    const msg = JSON.parse(e.data);
                    const cbs = this.listeners.filter(v => v.event === msg.event);
                    cbs.forEach(v => v.cb(msg.data));
                } catch { /* empty */ }
                return;
            }

            // logging path
            try {
                const raw = e.data;
                let msg = null;
                try {
                    msg = JSON.parse(raw);
                } catch (err) {
                    // not json
                }

                const eventName = (msg && msg.event) ? msg.event : "(unknown)";
                const { styleLabel, styleMethod, styleRoute } = this._getStyles("#2196f3"); // receive = blue

                console.groupCollapsed("%cWS%cRECV%c" + eventName, styleLabel, styleMethod, styleRoute);
                console.log("Raw message:\n", raw);
                console.log("Parsed message:\n", msg);
                // call callbacks after logging
                try {
                    const cbs = this.listeners.filter(v => v.event === (msg ? msg.event : null));
                    cbs.forEach(v => {
                        try { v.cb(msg ? msg.data : undefined); } catch (cbErr) {
                            console.error("Listener callback error for event", eventName, cbErr);
                        }
                    });
                } catch (cbFilterErr) {
                    console.error("Error while dispatching listeners:", cbFilterErr);
                }
                console.groupEnd();
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
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            if (this._shouldLog()) {
                const { styleLabel, styleMethod, styleRoute } = this._getStyles("#ff5722");
                console.groupCollapsed("%cWS%cSEND%c" + action, styleLabel, styleMethod, styleRoute);
                console.log("Attempt to send but socket not open. readyState:", this.ws ? this.ws.readyState : "(no socket)");
                console.log("Payload that was not sent:\n", data);
                console.groupEnd();
            }
            return;
        }

        const payload = {
            tData: {
                action,
                sessionID: getCookie("FURRYINDEXUSERTOKEN")
            },
            payload: data
        };

        try {
            this.ws.send(JSON.stringify(payload));

            if (this._shouldLog()) {
                const { styleLabel, styleMethod, styleRoute } = this._getStyles("#4caf50"); // send = green
                console.groupCollapsed("%cWS%cSEND%c" + action, styleLabel, styleMethod, styleRoute);
                console.log("Sent payload:\n", payload);
                console.groupEnd();
            }
        } catch (err) {
            if (this._shouldLog()) {
                const { styleLabel, styleMethod, styleRoute } = this._getStyles("#000000");
                console.groupCollapsed("%cWS%cSEND-ERROR%c" + action, styleLabel, styleMethod, styleRoute);
                console.error("Send error:", err);
                console.log("Payload:\n", payload);
                console.groupEnd();
            }
        }
    }

    static listen(event, cb, permanent) {
        this.listeners.push({ event, cb, permanent });

        if (this._shouldLog()) {
            const { styleLabel, styleMethod, styleRoute } = this._getStyles("#ff5722"); // listen = orange
            console.groupCollapsed("%cWS%cLISTEN%c" + event, styleLabel, styleMethod, styleRoute);
            console.log("Listener registered:", { event, permanent });
            console.log("Total listeners for event:", this.listeners.filter(l => l.event === event).length);
            console.groupEnd();
        }
    }

    static updateRoute() {
        this.send("updateRoute", { route: location.pathname });
        this.listeners = this.listeners.filter(listener => listener.permanent);
    }
}

WSController.connect();

export default WSController;
