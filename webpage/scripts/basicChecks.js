export default class BasicCheck {
    static MaxLen(text, max) {
        return text.length > max ? false : true
    }

    static MinLen(text, min) {
        return text.length < min ? false : true
    }
}