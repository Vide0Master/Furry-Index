import ENG from "../languages/ENG.js"
import UA from "../languages/UA.js"
import RU from "../languages/RU.js"

const languages = {
    ENG,
    UA,
    RU
}

class Language {
    static availableLanguages = Object.keys(languages)

    static currentLang = localStorage.getItem('language') || 'ENG'

    static lang = languages[this.currentLang]

    static setLanguage(lang, reload = false) {
        if (!this.availableLanguages.includes(lang)) return
        localStorage.setItem('language', lang)
        this.currentLang = lang
        this.lang = languages[this.currentLang]

        if (reload) location.reload();
    }
}

const browserLanguage = navigator.language.split('-')[0]

const langsInternal = {
    en: 'ENG',
    ru: 'RU',
    ua: 'UA'
}

if (Object.keys(langsInternal).includes(browserLanguage) && !localStorage.getItem('language'))
    Language.setLanguage(langsInternal[browserLanguage], false)

export default Language