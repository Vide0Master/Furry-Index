import TextLabel from "../../elements/textLabel/script.js"
import Elem from "../elem/script.js"

export default class TextInputLine extends Elem {
    constructor(desc, parent, cname, type, chcb) {
        super('input-container', parent, 'div')

        this.input = new Elem(null, this.element, 'input').element
        this.input.placeholder = ' '

        if (type) {
            this.input.type = type
        } else {
            this.input.type = 'text'
        }

        if (desc) {
            this.label = new Elem(null, this.element, 'label')
            this.label.text = desc
            this.label.element.setAttribute('for', desc)
            this.input.id = desc
        }

        this.input.addEventListener('keydown', (e) => {
            if (e.key == 'Escape') this.input.blur()
        })

        if (chcb) this.input.addEventListener('input', async () => {
            chcb((await this.testChecks(this.input.value)))
        })

        this.checks = []

        this.testChecks = async (val) => {
            let failed = false
            for (const check of this.checks) {
                if (!(await check(val))) failed == true
            }
            return failed ? null : val
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
        this.addCheck = (text, testFuncion) => {
            if (!this.checkBlock)
                this.checkBlock = new Elem('checks-box', this.element)

            const textObjMode = typeof text === 'object'

            const label = new TextLabel(textObjMode ? text.default : text, this.checkBlock.element, 'gray', true)

            this.checks.push(async (val) => {
                const testRslt = await testFuncion(val)

                if (testRslt && typeof testRslt !== 'string') {
                    label.setColor('var(--ok-color)')
                    if (textObjMode)
                        label.textElement.text = text.ok
                } else {
                    label.setColor('var(--nok-color)')
                    if (textObjMode)
                        label.textElement.text = typeof testRslt === 'string' ? `${text.nok} ${testRslt}` : text.nok
                }

                return typeof testRslt === 'text' ? false : testRslt
            })
        }
    }

    get value() {
        return this.input.value;
    }

    set value(val) {
        this.input.value = val;
    }
}