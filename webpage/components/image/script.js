import Language from "../../scripts/language.js"
import Button from "../button/script.js"
import Elem from "../elem/script.js"
import Icon from "../icon/script.js"

export default class Image extends Elem {
    constructor(src, alt, parent, blurred) {
        super("internal-image-container", parent, "div")

        this.image = new Elem(null, this.element, "img").element

        if (blurred) {
            const blur = new Elem("blur-overlay", this.element)

            if (blurred?.text) {
                new Button(Language.lang.elements.image.removeBlur, blur.element, "blur-rm", () => { blur.kill() })
            }
        }

        const loadingContainer = new Elem("internal-image-loading-container", this.element).element

        const pawCenteringElem = new Elem("paw-container", loadingContainer).element

        const paws = 8

        pawCenteringElem.style = `--global-timing: ${paws * 300}ms`

        for (let i = 0; i < paws; i++) {
            const pawIcon = new Icon("paw-loading", pawCenteringElem, "paw-icon").element
            let styles = pawIcon.getAttribute("style")
            pawIcon.style = `${styles} --rotation-pos: ${i * (360 / paws)}deg; --time-shift: ${i * 300}ms;`
        }

        this.image.addEventListener("load", () => {
            loadingContainer.remove()
        });

        this.image.src = src
        this.image.alt = alt
        if (parent) parent.appendChild(this.element)
    }
}