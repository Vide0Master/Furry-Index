import Elem from "../../components/elem/script.js";

const pageElems = 9

export default class PageNavigator extends Elem {
    constructor(pages, current, parent) {
        super('internal-page-navigator', parent);

        this.currentPage = current

        this.renderButtons(pages, current)

        this.navCB = []
        this.hovCB = []

        this.addNavCB = (cb) => {
            this.navCB.push(cb)
        }

        this.addHovCB = (cb) => {
            this.hovCB.push(cb)
        }

        this.navigate = (page) => {
            this.currentPage = page
            this.navCB.forEach(cb => cb(page))
        }

        this.hover = (page) => {
            this.hovCB.forEach(cb => cb(page))
        }
    }

    renderButtons(pages, current) {
        this.wipe()

        const prevBtn = new Elem('page-button', this.element)
        if (this.currentPage > 1) {
            prevBtn.element.classList.add('active')
            prevBtn.addEvent('click', () => { this.navigate(this.currentPage - 1) })
        }
        prevBtn.text = '<'

        for (let i = 0; i < pageElems; i++) {
            const pageButton = new Elem('page-button', this.element);
            const negative = Math.floor(pageElems / 2)

            const pageN = current - negative + i
            if (pageN <= 0 || pageN > pages) continue

            pageButton.element.classList.add('active')

            new Elem(null, pageButton.element).text = pageN

            pageButton.addEvent('hover', () => {
                this.hover(pageN)
            })

            pageButton.addEvent('click', () => {
                this.navigate(pageN)
            })
        }

        const nextBtn = new Elem('page-button', this.element)
        if (this.currentPage < pages) {
            nextBtn.element.classList.add('active')
            nextBtn.addEvent('click', () => { this.navigate(this.currentPage + 1) })
        }
        nextBtn.text = '>'
    }
}