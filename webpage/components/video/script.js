export default class Video {
    constructor(src, parent, options = {}) {
        this.element = document.createElement('div')
        this.element.className = 'internal-video-container'

        this.video = document.createElement('video')
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
