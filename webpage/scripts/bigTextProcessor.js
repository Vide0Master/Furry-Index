import Elem from "../components/elem/script.js"

export default function processText(text, parent) {
    const elem = new Elem('reg-info-cont', parent)
    for (const textB of text) {
        const block = new Elem('info-block', elem.element)

        if (textB.label) {
            const label = new Elem('label', block.element)
            label.text = textB.label
        }

        if (typeof textB.text === 'string') {
            const text = new Elem('text', block.element)
            text.text = textB.text
        } else if (typeof textB.text === 'object') {
            for (const str of textB.text) {
                const text = new Elem('text', block.element)
                text.text = str
            }
        }
    }
    return elem
}