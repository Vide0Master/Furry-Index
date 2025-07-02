import Elem from "../../components/elem/script.js";

export default class Overlay {
    constructor() {
        this.element = new Elem('internal-overlay', document.body).element
        this.enablePageScroll()

        this.element.addEventListener('click', (e) => {
            if (e.target != this.element) return
            this.element.remove()
            this.disablePageScroll()
        })
    }

    enablePageScroll() {
        document.body.classList.add('disable-scroll')
    }

    disablePageScroll() {
        document.body.classList.remove('disable-scroll')
    }
}