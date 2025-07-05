import Button from "../../components/button/script.js"
import Elem from "../../components/elem/script.js"
import Language from "../../scripts/language.js"

const alertsContainer = new Elem('alerts-container', document.body)

const alerts = {}

class AlertComponent {
    constructor(text, label, timeout, outlineColor, id) {
        if (alerts[id]) {
            alerts[id].highlight()
            return
        }

        this.alertCont = new Elem('alert', alertsContainer.element)

        this.alertCont.element.style = 'animation: internal-show-alert 0.2s cubic-bezier(0.075, 0.82, 0.165, 1) forwards;'
        const introTimeout = this.alertCont.element.addEventListener('animationend', (e) => {
            if (e.target != this.alertCont.element) return
            this.alertCont.element.style = ''
        })

        if (label) {
            this.alertLabel = new Elem('label', this.alertCont.element)
            this.alertLabel.text = label
        }

        if (text) {
            this.alertText = new Elem('text', this.alertCont.element)
            this.alertText.text = text
        }

        let style = ''
        if (outlineColor) {
            style += `--alert-border-color: ${outlineColor}`
        }

        this.removeAlert = () => {
            this.alertCont.element.style = 'animation: internal-hide-alert 0.2s cubic-bezier(0.075, 0.82, 0.165, 1) forwards;'
            this.alertCont.element.addEventListener('animationend', (e) => {
                if (e.target != this.alertCont.element) return
                this.alertCont.element.remove()
                delete alerts[id]
            })
        }

        this.highlight = () => {
            this.alertCont.element.style = 'animation: internal-shake-alert 0.4s linear forwards;'
            this.alertCont.element.addEventListener('animationend', (e) => {
                if (e.target != this.alertCont.element) return
                this.alertCont.element.style = ''
            })
        }

        alerts[id] = {
            highlight: this.highlight,
            remove: this.removeAlert,
            alert: this
        }

        this.okButton = new Button('OK', this.alertCont.element, null, this.removeAlert)

        if (timeout) {
            this.timeoutBar = new Elem('timeout-bar', this.alertCont.element)
            const timer = typeof timeout == "number" ? timeout : 5000
            this.timeoutBar.element.style = `--hide-time: ${timer}ms;`

            this.timeoutBar.element.addEventListener('animationend', () => {
                this.removeAlert()
            })
        }
    }
}

class Simple extends AlertComponent {
    constructor(text, label, timeout, outlineColor, id) {
        super(text, label, timeout, outlineColor, id)
    }
}

class Confirm extends AlertComponent {
    constructor(text, label, confirmCallback, cancelCallback, timeout, outlineColor, id) {
        super(text, label, timeout, outlineColor, id)

        this.confirmCallback = confirmCallback
        this.cancelCallback = cancelCallback

        const buttonsRow = new Elem('buttons-row', this.alertCont.element)

        this.okButton.element.remove()

        new Button(Language.lang.features.alert.confirm.confirmButton, buttonsRow.element, null, () => {
            if (typeof this.confirmCallback === "function") this.confirmCallback()
            this.removeAlert()
        })
        new Button(Language.lang.features.alert.confirm.cancelButton, buttonsRow.element, null, () => {
            if (typeof this.cancelCallback === "function") this.cancelCallback()
            this.removeAlert()
        })
    }
}

class Alert {
    static Simple = Simple
    static Confirm = Confirm
}

export default Alert