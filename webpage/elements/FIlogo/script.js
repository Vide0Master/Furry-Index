import Elem from "../../components/elem/script.js";

export default class FurrIndexLogo extends Elem {
    constructor(parent) {
        super('furry-index-logo', parent)

        const text = 'Furry Index'

        const fg = new Elem('foreground', this.element)

        new Elem('text', fg.element).text = text
    }
}