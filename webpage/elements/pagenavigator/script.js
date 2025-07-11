import Elem from "../../components/elem/script.js";

const pageElems = 9

export default class PageNavigator extends Elem {
    constructor(pages, current, parent) {
        super('internal-page-navigator', parent);
        console.log('pages:' + pages + ', current:' + current)

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
            this.navCB.forEach(cb => cb(page))
        }

        this.hover = (page) => {
            this.hovCB.forEach(cb => cb(page))
        }
    }

    renderButtons(pages, current) {
        this.wipe()

        for (let i = 0; i < pageElems; i++) {
            const pageButton = new Elem('page-button', this.element);
            const negative = Math.floor(pageElems / 2)

            const pageN = current - negative + i
            if (pageN <= 0 || pageN > pages) continue
            pageButton.text = pageN
            pageButton.element.classList.add('active')

            pageButton.addEvent('hover', () => {
                this.hover(pageN)
            })

            pageButton.addEvent('click', () => {
                this.navigate(pageN)
            })
        }
    }
}