import VMTechLogo from "../../elements/VMTechLogo/script.js"
import Elem from "../elem/script.js"
import Image from "../image/script.js"
import Link from "../link/script.js"
import Language from "../../scripts/language.js"
import Overlay from "../../features/overlay/script.js"
import processText from "../../scripts/bigTextProcessor.js";

export default class Footer {
    static element = document.createElement('footer')

    static render() {
        document.querySelector('body').appendChild(this.element)
    }
}

new VMTechLogo(Footer.element)

const githubLink = new Link(null, 'https://github.com/Vide0Master/Furry-Index', Footer.element, false, 'github-link')
githubLink.textElem.element.remove()
new Image('/icons/github-mark.svg', 'github-icon', githubLink.element)
new Elem('gthb-link-text', githubLink.element).text = 'GitHub'

const policyes = new Elem('policies-cont', Footer.element)
new Link(Language.lang.register.TOS, () => {
    const overlay = new Overlay()
    processText(Language.lang.TOS, overlay.element)
}, policyes.element, false, null, 'file')
new Link(Language.lang.register.PP, () => {
    const overlay = new Overlay()
    processText(Language.lang.PP, overlay.element)
}, policyes.element, false, null, 'file')