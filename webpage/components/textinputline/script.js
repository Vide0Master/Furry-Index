import Elem from "../elem/script.js"

export default class TextInputLine {
    constructor(desc, parent, cname, type, chcb) {
        this.element = document.createElement('div')

        this.input = document.createElement('input')
        this.input.placeholder = ' '
        this.element.appendChild(this.input)

        if (type) {
            this.input.type = type
        } else {
            this.input.type = 'text'
        }

        if (desc) {
            this.label = document.createElement('label')
            this.element.appendChild(this.label)
            this.label.innerText = desc
            this.label.setAttribute('for', desc)
            this.input.id = desc
        }

        if (parent) parent.appendChild(this.element)

        this.element.className = 'input-container'

        if (cname) {
            if (typeof cname === 'object') {
                for (const cn of cname)
                    this.input.className += cn
            } else {
                this.input.className += cn
            }
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
}