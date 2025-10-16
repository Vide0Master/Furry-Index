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

    static log(...args) {
        console.log("%c[WS]", "color: #00aaff; font-weight: bold;", ...args);
    }

    static warn(...args) {
        console.warn("%c[WS]", "color: orange; font-weight: bold;", ...args);
    }

    static error(...args) {
        console.error("%c[WS]", "color: red; font-weight: bold;", ...args);
    }

    static connect() {
        this.connectionAttempts++;
        this.log(`🛰️  Подключение #${this.connectionAttempts} к ${link}`);

        // если старое соединение не закрыто — закрываем
        if (this.ws) {
            try {
                this.ws.close();
            } catch (err) {
                this.error("Ошибка при закрытии старого соединения:", err);
            }
        }

        const ws = new WebSocket(link);
        this.ws = ws;

        ws.addEventListener("open", () => {
            this.log("🟢 Соединение установлено");
            this.updateRoute();
            this.startPing();
        });

        ws.addEventListener("close", (e) => {
            this.warn(
                `🔴 Соединение закрыто (code=${e.code}, reason="${e.reason || "нет"}")`
            );
            this.stopPing();
            this.scheduleReconnect();
        });

        ws.addEventListener("error", (err) => {
            this.error("⚠️ Ошибка соединения:", err);
            ws.close();
        });

        ws.addEventListener("message", (e) => {
            this.log(`📥 Получено сообщение (${e.data.length} байт)`);
            try {
                const msg = JSON.parse(e.data);
                this.log("   ➝ Распарсено:", msg);
                const cbs = this.listeners.filter(v => v.event === msg.event);
                if (cbs.length === 0) {
                    this.warn(`⚠️ Нет слушателей для события "${msg.event}"`);
                }
                cbs.forEach(v => v.cb(msg.data));
            } catch (err) {
                this.error("Ошибка при обработке сообщения:", err);
            }
        });
    }

    static scheduleReconnect() {
        if (this.reconnectTimeout) return; // уже ждём реконнекта
        this.warn(`⏳ Попытка реконнекта через ${this.reconnectDelay / 1000} сек...`);
        this.reconnectTimeout = setTimeout(() => {
            this.reconnectTimeout = null;
            this.connect();
        }, this.reconnectDelay);
    }

    static startPing() {
        this.stopPing();
        this.pingInterval = setInterval(() => {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.log("💓 Отправка ping");
                this.ws.send(JSON.stringify({ tData: { action: "ping" }, payload: {} }));
            } else {
                this.warn("💤 Пропуск ping — сокет не в состоянии OPEN");
            }
        }, 30000);
    }

    static stopPing() {
        if (this.pingInterval) {
            this.log("🛑 Остановка ping-интервала");
            clearInterval(this.pingInterval);
            this.pingInterval = null;
        }
    }

    static send(action, data) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            this.warn(`📤 Сообщение "${action}" не отправлено — сокет не в состоянии OPEN`);
            return;
        }

        const payload = {
            tData: {
                action,
                sessionID: getCookie("FURRYINDEXUSERTOKEN")
            },
            payload: data
        };

        this.log(`📤 Отправка сообщения:`, payload);
        try {
            this.ws.send(JSON.stringify(payload));
        } catch (err) {
            this.error("Ошибка при отправке сообщения:", err);
        }
    }

    static listen(event, cb, permanent) {
        this.listeners.push({ event, cb, permanent });
        this.log(`👂 Добавлен слушатель для события "${event}"`);
    }

    static updateRoute() {
        this.log(`🧭 Обновление маршрута: ${location.pathname}`);
        this.send("updateRoute", { route: location.pathname });
        this.listeners = this.listeners.filter(listener => listener.permanent);
    }
}

// подключаемся при загрузке
WSController.connect();

export default WSController;
