import Elem from "../elem/script.js"
import Language from "../../scripts/language.js"
import Button from "../button/script.js"

export default class Video extends Elem {
    constructor(src, parent, options = {}, ageRestriction) {
        super('internal-video-container', parent, 'div')

        this.video = new Elem(null, this.element, 'video').element
        this.video.src = src
        this.video.controls = true
        this.video.autoplay = options?.autoplay || false
        this.video.loop = options?.loop || false
        this.video.muted = options?.muted || false
        this.video.playsInline = true
        this.video.style.maxWidth = '100%'

        if (options?.poster) this.video.poster = options?.poster
        if (options?.width) this.video.width = options?.width

        this.element.appendChild(this.video)
        if (parent) parent.appendChild(this.element)

        if (ageRestriction) {
            const blur = new Elem('blur-overlay', this.element)

            if (ageRestriction?.text) {
                const textBlock = new Elem('text-block', blur.element)
                new Elem(null, textBlock.element).text = Language.lang.elements.image.ageRestriction.label
                const btnRow = new Elem('btn-row', textBlock.element)
                new Button(Language.lang.elements.image.ageRestriction.no, btnRow.element, null, () => { history.back() })
                new Button(Language.lang.elements.image.ageRestriction.yes, btnRow.element, null, () => { blur.kill() })
            }
        }
    }
}
