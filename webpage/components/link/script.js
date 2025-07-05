import Language from "../../scripts/language.js"
import Elem from "../elem/script.js"
import Icon from "../icon/script.js"

export default class Link extends Elem {
    constructor(text, link, parent, internal = true, cname, icon) {
        super(cname, parent, 'a')

        if (icon) {
            this.icon = new Icon(icon, this.element)
        }

        this.textElem = new Elem('link-text', this.element)
        this.textElem.text = text ? text : ""
        
        if (parent) parent.appendChild(this.element)

        if (cname) {
            if (typeof cname === 'object') {
                for (const cn of cname)
                    this.element.className += ' ' + cn
            } else {
                this.element.className = cname
            }
        }

        if (link) {
            this.element.href = link
        } else {
            console.error(this.element, Language.lang.cmd.errors.NOLINK)
        }

        if (internal) {
            this.element.setAttribute('internal', 'true')
        } else {
            this.element.setAttribute('external', 'true')
        }
    }

    get text() {
        return this.textElem.text
    }

    set text(text) {
        this.textElem.text = text
    }
}