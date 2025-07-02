export default class Button {
    constructor(text, parent, cname, cb) {
        this.element = document.createElement('button')
        if (text) this.element.innerText = text
        if (parent) parent.appendChild(this.element)
        if (cname) {
            if (typeof cname === 'object') {
                for (const cn of cname)
                    this.element.className += cn
            } else {
                this.element.className = cname
            }
        }
        if (cb) this.element.addEventListener('click', cb)
    }
}
