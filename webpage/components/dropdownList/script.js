import Elem from "../elem/script.js"
import Icon from "../icon/script.js"

export default class DropdownList extends Elem {
    constructor(options, parent, placeholder, chcb) {
        super('internal-dropdown', parent)

        new Icon('list', this.element)

        this.select = new Elem('selector', this.element, 'select')

        if (placeholder) this.select.element.appendChild(this.createOption(placeholder, 'placeholder', true, true))

        for (const option of options) {
            this.select.element.appendChild(this.createOption(option.name, option.value))
            if (option?.selected) {
                this.select.element.lastChild.selected = true
            }
        }

        if (chcb) this.select.element.addEventListener('change', () => {
            chcb(this.select.element.value)
        })

        delete this.select.text
    }

    createOption(name, value, selected = false, disabled = false) {
        const option = document.createElement('option')

        option.value = value
        option.innerText = name
        if (selected) option.selected = true
        if (disabled) option.disabled = true

        return option
    }
}
