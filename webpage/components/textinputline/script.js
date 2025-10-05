import TextLabel from "../../elements/textLabel/script.js"
import Elem from "../elem/script.js"

export default class TextInputLine extends Elem {
    constructor(desc, parent, cname, type, chcb) {
        super("input-container", parent, "div")

        if (cname) {
            switch (typeof cname) {
                case "object": cname.forEach(element => {
                    this.element.classList.add(element);
                }); break;
                case "string": this.element.classList.add(cname); break;
            }
        }

        switch (type) {
            case "bigTextField": {
                this.input = new Elem(null, this.element, "textarea").element
                this.input.placeholder = " "
            }; break;
            default: {
                this.input = new Elem(null, this.element, "input").element
                this.input.placeholder = " "

                if (type) {
                    this.input.type = type
                } else {
                    this.input.type = "text"
                }
            }; break;
        }

        if (desc) {
            this.label = new Elem(null, this.element, "label")
            this.label.text = desc
            this.label.element.setAttribute("for", desc)
            this.input.id = desc
        }

        this.input.addEventListener("keydown", (e) => {
            if (e.key == "Escape") this.input.blur()
        })

        this.testChecksWithCB = async (silent = true) => {
            if (!silent) await chcb(this.input.value)
            return (await this.testChecks(this.input.value))
        }

        if (chcb) this.input.addEventListener("input", async () => {
            await this.testChecksWithCB(false)
        })

        this.checks = []
        this.checksInf = {
            okAny: false,
            okAll: false,
            errAny: false,
            errAll: false,
            status: [],
            reset: () => {
                this.checksInf.okAny = false
                this.checksInf.okAll = false
                this.checksInf.errAny = false
                this.checksInf.errAll = false
            }
        }

        this.testChecks = async (val) => {
            this.checksInf.reset()
            this.checksInf.status = []

            for (const checkFunc of this.checks) {
                const checkResult = await checkFunc(val)
                this.checksInf.status.push(checkResult)
            }

            function isOk(v) {
                return typeof v === "boolean" ? v : false
            }

            const statuses = this.checksInf.status

            this.checksInf.okAll = statuses.every(v => isOk(v))
            this.checksInf.okAny = statuses.some(v => isOk(v))
            this.checksInf.errAll = statuses.every(v => !isOk(v))
            this.checksInf.errAny = statuses.some(v => !isOk(v))

            console.log(this.checksInf)
            return this.checksInf.okAll ? val : null
        }

        // So... about this code...
        // This is HELL ASS CODE to test test field for errors...
        // It all start here, with creation of checks block
        // After that, it registers function in this.checks
        // When input is triggered, it triggers function testChecks
        // Test checks goes on all checks, they set TextLabel's to red if error, or green if ok
        // If all checks passed - returns input value, else - null

        // So... memba this... i'm not pro, nor i'm noob... idk what i am...
        // If someone finds and reads this, dm me in any way, i will be happy to talk with you! :D

        // 03.10.2025
        // so, this is bad, as i tested before
        // in developing, i underestimated checks 
        // so, here will be some rework, also some changes that will be implemented in register page...
        // T.T

        this.addCheck = (text, testFuncion) => {
            if (!this.checkBlock) {
                this.checkBlock = new Elem("checks-box", this.element)
            }

            const textObjMode = typeof text === "object"

            const label = new TextLabel(textObjMode ? text.default : text, this.checkBlock.element, "gray", true)

            this.checks.push(async (val) => {
                const testRslt = await testFuncion(val)

                if (testRslt && typeof testRslt !== "string") {
                    label.setColor("var(--ok-color)")
                    if (textObjMode)
                        label.textElement.text = text.ok
                } else {
                    label.setColor("var(--nok-color)")
                    if (textObjMode)
                        label.textElement.text = typeof testRslt === "string" ? `${text.nok} ${testRslt}` : text.nok
                }

                return typeof testRslt === "boolean" ? testRslt : false
            })
        }
    }

    get value() {
        return this.input.value;
    }

    set value(val) {
        this.input.value = val;
    }

    set enabled(state) {
        if (state) {
            this.input.removeAttribute("disabled")
        } else {
            this.input.setAttribute("disabled", "")
        }
    }
}