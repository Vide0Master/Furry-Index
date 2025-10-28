import Language from "../../scripts/language.js"
import Elem from "../elem/script.js"
import Icon from "../icon/script.js"
import Link from "../link/script.js"

export default class DropdownList extends Elem {
    constructor(options, parent, placeholder, chcb, labelPrefix = "") {
        super("internal-dropdown", parent)

        this.options = options

        this.labelPrefix = labelPrefix

        this.placeholderName = placeholder

        const label = new Elem("label", this.element)
        this.icon = new Icon("list", label.element)
        this.textLabel = new Elem("text-label", label.element)
        this.textLabel.text = placeholder ? placeholder : Language.lang.elements.dropdown.label

        this.optionsBlock = new Elem("options-block", this.element)

        this.currentOption = "placeholder"

        if (labelPrefix === "")
            this.createOption(placeholder ? placeholder : Language.lang.elements.dropdown.label, "placeholder", false)

        for (const option of options) {
            this.createOption(option.name, option.value, undefined, option.icon)
            if (option?.selected) {
                this.currentOption = option.value
                this.textLabel.text = this.labelPrefix + option.name
            }
        }

        if (chcb) this.chcb = () => {
            chcb(this.currentOption)
        }

        label.addEvent("click", () => {
            this.element.classList.toggle("dd-visible")
        })

        this.addEvent("mouseleave", () => {
            this.element.classList.toggle("dd-visible", false)
        })
    }

    createOption(name, value, enabled = true, icon) {
        switch (true) {
            case value.toString().startsWith("link:"): {
                const linkValue = value.match(/link:([^\s+]+)/)?.[1];
                const link = new Link(name, linkValue, this.optionsBlock.element, undefined, "option", icon)
                if (enabled) {
                    link.addEvent("click", () => {
                        this.currentOption = value
                        if (this.labelPrefix) {
                            this.textLabel.text = this.labelPrefix + name
                        } else {
                            this.textLabel.text = name
                        }
                        this.element.classList.toggle("dd-visible", false)
                        if (this.chcb) this.chcb()
                    })
                } else {
                    link.element.classList.add("disabled")
                }
            }; break;
            default: {
                const option = new Elem("option", this.optionsBlock.element)
                if (icon) new Icon(icon, option.element)

                new Elem("option-text", option.element).text = name

                if (enabled) {
                    option.addEvent("click", () => {
                        this.currentOption = value
                        if (this.labelPrefix) {
                            this.textLabel.text = this.labelPrefix + name
                        } else {
                            this.textLabel.text = name
                        }
                        this.element.classList.toggle("dd-visible", false)
                        if (this.chcb) this.chcb()
                    })
                } else {
                    option.element.classList.add("disabled")
                }
            }; break;
        }
    }

    selectOption(option) {
        if (!this.options.some(v => v.value == option) && option != "placeholder") return
        if (option == "placeholder") {
            this.textLabel.text = this.placeholderName
        } else {
            this.value = option
            this.chcb()
        }
    }

    get value() {
        return this.currentOption
    }

    set value(value) {
        this.currentOption = value
        if (value != "placeholder") {
            this.textLabel.text = this.labelPrefix + this.options[this.options.findIndex(v => v.value == value)].name
        } else {
            this.textLabel.text = this.placeholderName
        }
    }
}
