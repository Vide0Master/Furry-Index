import Elem from "../elem/script.js"

export default class Button extends Elem {
    constructor(text, parent, cname, cb) {
        super(cname, parent, "button")
        if (text) this.text = text
        if (cb) this.element.addEventListener("click", cb)
    }

    set enabled(state) {
        if (state) {
            this.element.removeAttribute("disabled")
        } else {
            this.element.setAttribute("disabled", "")
        }
    }
}
