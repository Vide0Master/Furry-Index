export default class Elem {
    constructor(cname, parent, tag) {
        this.element = document.createElement('div')

        if (tag) {
            this.element.remove()
            this.element = document.createElement(tag)
        }

        if (cname) {
            if (typeof cname === 'object') {
                this.element.className = cname.join(' ')
            } else {
                this.element.className = cname
            }
        }

        this.append = (parent) => {
            parent.appendChild(this.element)
        }

        if (parent) this.append(parent)

        this.moveAfter = (elem) => {
            elem.insertAdjacentElement('afterend', this.element);
        }
    }

    get text() {
        return this.element.innerText
    }

    set text(text) {
        this.element.innerText = text
    }
}