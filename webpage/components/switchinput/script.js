import Elem from "../elem/script.js"

export default class SwitchInput {
    constructor(desc, parent, chcb, checked = false, cname) {
        this.element = new Elem('input-switch', parent)

        this.checkbox = new Elem('checkbox', this.element.element, 'input')
        this.checkbox.element.type = 'checkbox'

        new Elem('swatch', this.element.element)

        this.text = new Elem('input-switch-label', this.element.element)
        this.text.text = desc

        this.checkbox.element.checked = checked

        if (chcb) {
            this.checkbox.element.addEventListener('change', () => {
                chcb(this.checkbox.element.checked)
            })
        }

        this.change = (state) => {
            if (typeof state == 'boolean') {
                this.checkbox.element.checked = state
            } else {
                this.checkbox.element.checked = !this.checkbox.element.checked
            }
        }
    }
}