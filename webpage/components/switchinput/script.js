import Elem from "../elem/script.js"
import Icon from "../icon/script.js"

export default class SwitchInput extends Elem {
    constructor(desc, parent, chcb, checked = false, cname, manuallyControlled = true) {
        super('input-switch', parent, 'div')

        this.label = new Elem('input-switch-label', this.element)
        this.label.text = desc

        this.checkbox = new Elem('checkbox', this.element, 'input').element
        this.checkbox.type = 'checkbox'

        const swatch = new Elem('swatch', this.element)

        const icon = new Icon(checked ? "check" : "cross", swatch.element)

        this.checkbox.checked = checked

        if (cname) {
            this.element.classList.add(cname)
        }

        this.checkbox.addEventListener('change', (e) => {
            if (!manuallyControlled) { this.change() } else { icon.iconName = this.checkbox.checked ? "check" : "cross" }
            if (chcb) chcb(this.checkbox.checked)
        })

        this.change = (state) => {
            if (typeof state == 'boolean') {
                this.checkbox.checked = state
            } else {
                this.checkbox.checked = !this.checkbox.checked
            }

            icon.iconName = this.checkbox.checked ? "check" : "cross"
        }
    }

    set text(text) {
        this.label.text = text
    }

    get text() {
        return this.label.text
    }

    get value() {
        return this.checkbox.checked
    }

    set value(val) {
        this.change(val)
    }
}