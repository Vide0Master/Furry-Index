import Elem from "../../components/elem/script.js";

export default class TextLabel {
    constructor(text, parent, color, transparent = false) {
        this.element = new Elem('label-elem', parent)
        if (text) this.element.text = text
        if (color) this.element.element.style = `--internal-label-color: ${color};`
        if (transparent) this.element.element.classList.add('transparent-bg')
    }
}