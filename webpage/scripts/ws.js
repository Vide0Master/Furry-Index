const link = (location.protocol === 'https:' ? 'wss' : 'ws') + `://${window.location.host}`

const ws = new WebSocket(link)

ws.addEventListener("close", (e) => {
    console.warn("WebSocket connection closed:", e.code, e.reason);
});

ws.addEventListener("error", (err) => {
    console.error("WebSocket error:", err);
});


function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
        const [key, value] = cookie.split('=');
        if (key === name) return decodeURIComponent(value);
    }
    return null;
}

class WSController {
    static send(action, data) {
        ws.send(JSON.stringify({
            tData: {
                action,
                sessionID: getCookie('FURRYINDEXUSERTOKEN')
            },
            payload: data
        }))
    }

    static listeners = []

    static listen(event, cb, permanent) {
        this.listeners.push({ event, cb, permanent })
    }

    static updateRoute() {
        this.send('updateRoute', { route: location.pathname })
        this.listeners = this.listeners.filter(listener => listener.permanent);
    }
}

ws.addEventListener("open", () => {
    WSController.updateRoute()
});

ws.addEventListener("message", (e) => {
    try {
        const msg = JSON.parse(e.data);
        const cbs = WSController.listeners.filter(v => v.event == msg.event)
        cbs.forEach(v => { v.cb(msg.data) })
    } catch { }
});

export default WSController
