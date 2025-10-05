import Elem from "../elem/script.js";
import TextInputLine from "../textinputline/script.js";

export default class BigTextField extends TextInputLine {
    constructor(desc, parent, limit = 2000, chcb) {
        super(desc, parent, "big-text-field", "bigTextField")

        this.limit = limit

        const limitElem = new Elem("limit-elem", this.element)
        limitElem.moveAfter(this.label.element)

        this.setLimit = (val, max) => {
            if (max) {
                limitElem.text = `${val} / ${max}`
            } else {
                limitElem.text = val
            }
        }

        if (typeof limit == "number" && limit != 0) {
            this.setLimit(0, limit)
        }

        this.input.addEventListener("input", () => {
            this.input.style.height = "auto"
            this.input.style.height = this.input.scrollHeight + "px"

            if (typeof limit == "number" && limit != 0) {
                if (this.value.length > limit) {
                    this.value = this.value.slice(0, limit)
                }
                this.setLimit(this.value.length, limit)
            }
        })

        if (chcb) this.input.addEventListener("input", async () => {
            if (typeof limit == "number" && this.value.length > limit) return
            chcb(this.value)
            await this.testChecksWithCB(true)
            //chcb(this.input.value)
        })
    }

    set value(val) {
        this.input.value = val
        if (typeof this.limit == "number") this.setLimit(this.value.length, this.limit)
    }

    get value() {
        return this.input.value
    }
}