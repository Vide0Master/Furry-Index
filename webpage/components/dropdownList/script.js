export default class DropdownList {
    constructor(options, parent, placeholder, chcb) {
        this.element = document.createElement('select')
        this.element.classList.add('internal-dropdown')
        if (parent) parent.appendChild(this.element)

        if (placeholder) this.element.appendChild(this.createOption(placeholder, 'placeholder', true, true))

        for (const option of options) {
            this.element.appendChild(this.createOption(option.name, option.value))
        }

        if (chcb) this.element.addEventListener('change', () => {
            chcb(this.element.value)
        })
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
