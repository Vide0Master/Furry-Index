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

        // YOU GOTTA KILL EM ALL
        this.kill = () => {
            this.element.remove()
        }

        this.wipe = () => {
            this.element.innerHTML = ''
        }

        this.addEvent = (event, func, once = false) => {
            this.element.addEventListener(event, func, { once })
        }

        this.onAnimationEnd = (cb) => {
            this.addEvent('animationend', cb, true)
        }

        this.addClass = (c) => {
            this.element.classList.add(c)
        }

        this.rmClass = (c) => {
            this.element.classList.remove(c)
        }

        this.setStyleProperty = (prop, value) => {
            this.element.style.setProperty(prop, value)
        }

        this.rmStyleProperty = (prop) => {
            this.element.style.removeProperty(prop)
        }
    }

    get text() {
        return this.element.innerText
    }

    set text(text) {
        this.element.innerText = text
    }

    set title(text) {
        this.element.title = text
    }
}