import Elem from "../../components/elem/script.js";

const overlays = []

export default class Overlay extends Elem {
    constructor(closeOnClick = true) {
        super("internal-overlay", document.body)
        this.disablePageScroll()

        overlays.push(this)

        history.pushState({ overlayOpen: true }, "")

        if (closeOnClick)
            this.element.addEventListener("click", (e) => {
                if (e.target != this.element) return
                this.close()
            })
    }

    disablePageScroll() {
        document.body.classList.add("disable-scroll")
    }

    enablePageScroll() {
        document.body.classList.remove("disable-scroll")
    }

    close() {
        this.element.remove()
        this.enablePageScroll()

        if (history.state?.overlayOpen) {
            history.replaceState({}, "")
        }

        const index = overlays.indexOf(this)
        if (index > -1) overlays.splice(index, 1)
    }

    static clearOverlays() {
        while (overlays.length) {
            overlays[overlays.length - 1].close()
        }
    }
}

window.addEventListener("popstate", () => {
    if (overlays.length > 0) {
        overlays[overlays.length - 1].close()
    }
});
