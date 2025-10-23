import TextInputLine from "../textinputline/script.js";

export default class BigTextField extends TextInputLine {
    constructor(desc, parent, limit = 1000, chcb) {
        super(desc, parent, null, "bigTextField", chcb, limit)
    }
}