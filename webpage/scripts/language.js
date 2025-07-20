import ENG from "../languages/ENG.js"
import UA from "../languages/UA.js"
import RU from "../languages/RU.js"

const languages = {
    ENG,
    UA,
    RU
}

export default class Language {
    static availableLanguages = Object.keys(languages)

    static currentLang = localStorage.getItem('language') || 'ENG'

    static lang = languages[this.currentLang]

    static setLanguage(lang) {
        if (!this.availableLanguages.includes(lang)) return
        localStorage.setItem('language', lang)
        this.currentLang = lang
        this.lang = languages[this.currentLang]

        location.reload();
    }
}
