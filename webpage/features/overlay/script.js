import Elem from "../../components/elem/script.js";

const overlays = []

export default class Overlay extends Elem {
    constructor() {
        super('internal-overlay', document.body)
        this.disablePageScroll()

        overlays.push(this)

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

    static clearOverlays(){
        for(const overlay of overlays){
            overlay.kill()
        }
    }
}