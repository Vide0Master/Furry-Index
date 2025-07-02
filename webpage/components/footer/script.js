import VMTechLogo from "../../elements/VMTechLogo/script.js"

export default class Footer {
    static element = document.createElement('footer')

    static render() {
        document.querySelector('body').appendChild(this.element)
    }
}

new VMTechLogo(Footer.element)