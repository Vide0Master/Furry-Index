import TextInputLine from "../textinputline/script.js";


export default class PasswordInput extends TextInputLine {
    constructor(desc, parent, cname, chcb) {
        super(desc, parent, cname, 'password', chcb);
    }
}