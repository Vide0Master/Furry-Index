import Elem from "../../components/elem/script.js"

export default class VMTechLogo {
    constructor(parent) {
        this.element = new Elem('VMTech-logo').element
        const text = new Elem('text', this.element).element
        const textBlock = new Elem('', text)
        textBlock.element.innerText = 'Hosted on'
        textBlock.element.style = 'margin-right: 0.25em;'
        const v = new Elem('', text)
        v.element.style = 'color: #c62020;'
        v.element.innerText = 'V'
        const m = new Elem('', text)
        m.element.style = 'color: #208fc6;'
        m.element.innerText = 'M'
        const tech = new Elem('', text)
        tech.element.style = 'margin-left: 0.25em;'
        tech.element.innerText = 'Tech'
        new Elem('gradient-line', this.element)
        if (parent) parent.appendChild(this.element)
    }
}