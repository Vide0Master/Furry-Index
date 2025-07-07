import Elem from "../elem/script.js";

export default class BigTextField extends Elem {
    constructor(desc, parent, limit = 2000, chcb) {
        super('big-text-field', parent)

        this.limit = limit

        this.inputElement = new Elem(null, this.element, 'textarea').element
        this.inputElement.placeholder = ' '

        if (desc) {
            this.label = new Elem(null, this.element, 'label').element
            this.label.innerText = desc
        }

        const limitElem = new Elem('limit-elem', this.element)

        this.setLimit = (val, max) => {
            if (max) {
                limitElem.text = `${val} / ${max}`
            } else {
                limitElem.text = val
            }
        }

        if (typeof limit == 'number') {
            this.setLimit(0, limit)
        }

        this.inputElement.addEventListener('input', () => {
            this.inputElement.style.height = 'auto'
            this.inputElement.style.height = this.inputElement.scrollHeight + 'px'

            if (typeof limit == 'number') {
                if (this.inputElement.value.length > limit) {
                    this.inputElement.value = this.inputElement.value.slice(0, limit)
                }
                this.setLimit(this.inputElement.value.length, limit)
            }
        })

        if (chcb) {
            this.inputElement.addEventListener('input', () => {
                if (typeof limit == 'number' && this.inputElement.value.length > limit) return
                chcb(this.inputElement.value)
            })
        }
    }

    set input(val) {
        this.inputElement.value = val
        if (typeof this.limit == 'number') this.setLimit(this.inputElement.value.length, this.limit)
    }

    get input() {
        return this.inputElement.value
    }
}