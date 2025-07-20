import Elem from "../../components/elem/script.js";

export default class Countdown extends Elem {
    constructor(timeLimit, parent, startTime, finishCB) {
        super('internal-countdown', parent);

        this.timeLimit = timeLimit instanceof Date
            ? timeLimit.getTime()
            : new Date(timeLimit).getTime();

        this.startTime = startTime instanceof Date
            ? startTime.getTime()
            : new Date(startTime).getTime();

        this.startRoute = window.location.pathname;

        this._interval = null;

        if (this.startTime < this.timeLimit) {
            this.countdownCircle = new Elem('countdown-circle', this.element);
            new Elem('countdown-cover', this.countdownCircle.element);
        }

        this.countdownText = new Elem('countdown-text', this.element);

        this.finishCB = finishCB

        this.update();
        this._interval = setInterval(() => this.update(), 1000);
    }

    formatTime(remainingMs) {
        const totalSec = Math.floor(remainingMs / 1000);
        const hours = Math.floor(totalSec / 3600);
        const minutes = Math.floor((totalSec % 3600) / 60);
        const seconds = totalSec % 60;

        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    update() {
        // INFO: WELL FUCK!
        // This single killer will be NOT ENOUGH!!!
        // Whole app has a bunch of mistakes with memory leaks
        // pi-archive didn't have this issues cuz every page is loaded from server and rendered from scratch
        // this has manual updates...
        // solution to timer problems that is created lower is temporary too
        // i don't know normal solution to this problem, so...
        // if it will be real problem of the app, well i'll fix it, but not now...

        if (window.location.pathname !== this.startRoute) {
            this.kill();
            return;
        }

        const now = Date.now();
        const remaining = this.timeLimit - now;

        if (remaining <= 0) {
            clearInterval(this._interval);
            if (this.finishCB) this.finishCB()
            if (this.countdownCircle) this.countdownCircle.element.style = '--progress: 0deg;'
            return;
        }

        this.countdownText.text = this.formatTime(remaining);

        if (this.countdownCircle) {
            const totalDuration = this.timeLimit - this.startTime;
            let fraction = totalDuration > 0 ? remaining / totalDuration : 0;
            fraction = Math.max(0, Math.min(1, fraction));

            const degrees = fraction * 360;
            this.countdownCircle.element.style.setProperty('--progress', `${degrees}deg`);
        }
    }

    kill() {
        clearInterval(this._interval);
        super.kill();
    }
}
