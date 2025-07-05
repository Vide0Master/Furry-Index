export default class Elem {
    constructor(cname, parent, tag= 'div') {
        this.element = document.createElement(tag)

        if (cname) {
            if (typeof cname === 'object') {
                for (const cn of cname)
                    this.element.classList.add(cn)
            } else {
                this.element.classList.add(cname)
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