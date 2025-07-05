import Elem from "../../components/elem/script.js";

export default class Overlay {
    constructor() {
        this.element = new Elem('internal-overlay', document.body).element
        this.disablePageScroll()

        this.element.addEventListener('click', (e) => {
            if (e.target != this.element) return
            this.element.remove()
            this.enablePageScroll()
        })
    }

    disablePageScroll() {
        document.body.classList.add('disable-scroll')
    }

    enablePageScroll() {
        document.body.classList.remove('disable-scroll')
    }
}