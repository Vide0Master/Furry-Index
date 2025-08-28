import Language from "../../scripts/language.js"
import Elem from "../elem/script.js"
import Icon from "../icon/script.js"

export default class DropdownList extends Elem {
    constructor(options, parent, placeholder, chcb, labelPrefix = '') {
        super('internal-dropdown', parent)

        this.options = options

        this.labelPrefix = labelPrefix

        this.placeholderName = placeholder

        const label = new Elem('label', this.element)
        new Icon('list', label.element)
        this.textLabel = new Elem('text-label', label.element)
        this.textLabel.text = placeholder ? placeholder : Language.lang.elements.dropdown.label

        this.optionsBlock = new Elem('options-block', this.element)

        this.currentOption = 'placeholder'

        this.createOption(placeholder ? placeholder : Language.lang.elements.dropdown.label, 'placeholder', false)

        for (const option of options) {
            this.createOption(option.name, option.value)
            if (option?.selected) {
                this.currentOption = option.value
                this.textLabel.text = this.labelPrefix + option.name
            }
        }

        if (chcb) this.chcb = () => {
            chcb(this.currentOption)
        }

        label.addEvent('click', () => {
            this.element.classList.toggle('dd-visible')
        })

        this.addEvent('mouseleave', () => {
            this.element.classList.toggle('dd-visible', false)
        })
    }

    createOption(name, value, enabled = true) {
        const option = new Elem('option', this.optionsBlock.element)
        option.text = name

        if (enabled) {
            option.addEvent('click', () => {
                this.currentOption = value
                this.textLabel.text = this.labelPrefix + name
                this.element.classList.toggle('dd-visible', false)
                if (this.chcb) this.chcb()
            })
        } else {
            option.element.classList.add('disabled')
        }
    }

    get value() {
        return this.currentOption
    }

    set value(value) {
        this.currentOption = value
        if (value != 'placeholder') {
            this.textLabel.text = this.labelPrefix + this.options[this.options.findIndex(v => v.value == value)].name
        } else {
            this.textLabel.text = this.placeholderName
        }
    }
}
