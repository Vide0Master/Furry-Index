export default class Icon {
    constructor(iconName, parent, cname, size) {
        this.element = document.createElement('div')
        this.element.classList.add('icon-elem')

        this.size = { x: 16, y: 16 }
        if (size) {
            const sizematch = size.match(/^(\d+)x(\d+)$/);
            this.size = { x: sizematch[1], y: sizematch[2] }
        }
        this.element.style = `--width: ${this.size.x}px; --height: ${this.size.y}px; --iconURL: URL(/icons/${iconName}.svg);`

        if (cname) {
            if (typeof cname === 'object') {
                for (const cn of cname)
                    this.element.classList.add(cn)
            } else {
                this.element.classList.add(cname)
            }
        }

        if (parent) parent.appendChild(this.element)
    }
}