export default class Elem {
    constructor(cname, parent, tag = 'div') {
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

        this.switchVisible = (state) => {
            this.element.classList.toggle('hidden', !state)
        }

        this.kill = () => {
            this.element.remove()
        }

        this.wipe = () => {
            this.element.innerHTML = ''
        }

        this.addEvent = (event, func, once = false) => {
            this.element.addEventListener(event, func, { once })
        }
    }

    get text() {
        return this.element.innerText
    }

    set text(text) {
        this.element.innerText = text
    }
}