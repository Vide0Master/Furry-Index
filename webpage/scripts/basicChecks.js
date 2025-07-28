export default class BasicCheck {
    static MaxLen(text, max) {
        return text.length > max
    }

    static MinLen(text, min) {
        return text.length < min
    }

    static includesUppercase(text) {
        return /[A-Z]/.test(text);
    }

    static includesLowercase(text) {
        return /[a-z]/.test(text);
    }

    static includesDigit(text) {
        return /\d/.test(text);
    }

    static getNonLatinChars(text) {
        const nonLatin = text.match(/\P{Script=Latin}/gu);
        return nonLatin || [];
    }

    static isLatinOnly(text) {
        return this.getNonLatinChars(text).length === 0;
    }
}