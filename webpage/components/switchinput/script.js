import Elem from "../elem/script.js"

export default class SwitchInput extends Elem {
    constructor(desc, parent, chcb, checked = false, cname) {
        super('input-switch', parent, 'div')

        this.checkbox = new Elem('checkbox', this.element, 'input').element
        this.checkbox.type = 'checkbox'

        new Elem('swatch', this.element)

        this.label = new Elem('input-switch-label', this.element)
        this.label.text = desc

        this.checkbox.checked = checked

        if (chcb) {
            this.checkbox.addEventListener('change', () => {
                chcb(this.checkbox.checked)
            })
        }

        this.change = (state) => {
            if (typeof state == 'boolean') {
                this.checkbox.checked = state
            } else {
                this.checkbox.checked = !this.checkbox.checked
            }
        }
    }

    set text(text) {
        this.label.text = text
    }

    get text() { 
        return this.label.text
    }
}