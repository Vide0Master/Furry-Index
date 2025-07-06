import Elem from "../elem/script.js"

export default class TextInputLine extends Elem {
    constructor(desc, parent, cname, type, chcb) {
        super('input-container', parent, 'div')

        this.input = new Elem(null, this.element, 'input').element
        this.input.placeholder = ' '

        if (type) {
            this.input.type = type
        } else {
            this.input.type = 'text'
        }

        if (desc) {
            this.label = new Elem(null,this.element,'label')
            this.label.text = desc
            this.label.element.setAttribute('for', desc)
            this.input.id = desc
        }

        this.input.addEventListener('keydown', (e) => {
            if (e.key == 'Escape') this.input.blur()
        })

        if (chcb) this.input.addEventListener('input', () => {
            chcb(this.input.value)
        })

        this.displayError = (text) => {
            if (this.errorElem) this.errorElem.element.remove()

            this.errorElem = new Elem('error', this.element)

            this.element.classList.add('error')
            this.errorElem.element.innerText = text
        }

        this.removeError = () => {
            this.element.classList.remove('error')
            if (this.errorElem) this.errorElem.element.remove()
        }
    }

    get value() {
        return this.input.value;
    }

    set value(val){
        this.input.value = val;
    }
}