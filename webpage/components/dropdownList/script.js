import Elem from "../elem/script.js"

export default class DropdownList extends Elem {
    constructor(options, parent, placeholder, chcb) {
        super('internal-dropdown', parent, 'select')

        if (placeholder) this.element.appendChild(this.createOption(placeholder, 'placeholder', true, true))

        for (const option of options) {
            this.element.appendChild(this.createOption(option.name, option.value))
            if (option?.selected) {
                this.element.lastChild.selected = true
            }
        }

        if (chcb) this.element.addEventListener('change', () => {
            chcb(this.element.value)
        })

        delete this.text
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
