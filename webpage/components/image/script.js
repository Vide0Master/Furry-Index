import Elem from "../elem/script.js"
import Icon from "../icon/script.js"

export default class Image {
    constructor(src, alt, parent) {
        this.element = document.createElement('div')
        this.element.className = 'internal-image-container'

        this.image = document.createElement('img')
        this.element.appendChild(this.image)

        const loadingContainer = new Elem('internal-image-loading-container', this.element)

        const pawCenteringElem = new Elem('paw-container', loadingContainer.element)

        const paws = 8

        pawCenteringElem.element.style =`--global-timing: ${paws*300}ms`

        for (let i = 0; i < paws; i++) {
            const pawIcon = new Icon('paw-loading', pawCenteringElem.element, 'paw-icon')
            let styles = pawIcon.element.getAttribute('style')
            pawIcon.element.style = `${styles} --rotation-pos: ${i * (360 / paws)}deg; --time-shift: ${i*300}ms;`
        }

        this.image.addEventListener('load', () => {
            loadingContainer.element.remove()
        });

        this.image.src = src
        this.image.alt = alt
        if (parent) parent.appendChild(this.element)
    }
}