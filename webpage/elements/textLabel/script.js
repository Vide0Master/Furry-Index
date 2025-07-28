import Elem from "../../components/elem/script.js";

export default class TextLabel extends Elem {
    constructor(text, parent, color, transparent = false) {
        super('label-elem', parent)

        if (text) {
            this.textElement = new Elem('text', this.element)
            this.textElement.text = text
        }

        if (color) this.element.style.setProperty('--internal-label-color', color)

        if (transparent) this.element.classList.add('transparent-bg')

        this.setColor = (color) => {
            this.element.style.setProperty('--internal-label-color', color)
        }
    }
}