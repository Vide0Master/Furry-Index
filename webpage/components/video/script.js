import Elem from "../elem/script.js"

export default class Video extends Elem {
    constructor(src, parent, options = {}) {
        super('internal-video-container', parent, 'div')

        this.video = new Elem(null, this.element, 'video').element
        this.video.src = src
        this.video.controls = true
        this.video.autoplay = options.autoplay || false
        this.video.loop = options.loop || false
        this.video.muted = options.muted || false
        this.video.playsInline = true
        this.video.style.maxWidth = '100%'

        if (options.poster) this.video.poster = options.poster
        if (options.width) this.video.width = options.width

        this.element.appendChild(this.video)
        if (parent) parent.appendChild(this.element)
    }
}
