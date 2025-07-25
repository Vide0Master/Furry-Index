import Elem from '../elem/script.js'
import Link from '../link/script.js'
import UserLabel from '../../elements/userLabel/script.js'
import lang from '../../languages/ENG.js'
import Language from '../../scripts/language.js'
import User from '../../scripts/userdata.js'

export default class Header {
    static render() {
        const body = document.querySelector('body')
        this.element = document.createElement('header')
        body.appendChild(this.element)

        const navRow = new Elem('nav-row', this.element, 'nav')

        this.main = new Link(Language.lang.header.main, '/', navRow.element)
        this.settings = new Link(Language.lang.header.search, '/search', navRow.element, true)
        this.settings = new Link(Language.lang.header.settings, '/settings', navRow.element, true, null, 'settings')
        this.upload = new Link(Language.lang.header.upload, '/upload', navRow.element, true, 'hidden', 'upload')
        this.fileManager = new Link(Language.lang.header.fileManager, '/file-manager', navRow.element, true, 'hidden')
        this.postMaster = new Link('✦ ' + Language.lang.header.postMaster, '/post-master', navRow.element, true)

        UserLabel.append(navRow.element)

        this.checkUserLoginState()
    }

    static checkUserLoginState() {
        this.showLoggenInOptions(!!User.data)
        this.showAdminOptions(false)
    }

    static showLoggenInOptions(state) {
        const loggenInOptions = [this.upload, this.fileManager, this.postMaster]

        for (const elem of loggenInOptions) {
            state ? elem.element.classList.remove("hidden") : elem.element.classList.add("hidden")
        }
    }

    static showAdminOptions(state) {
        const loggenInOptions = []

        for (const elem of loggenInOptions) {
            state ? elem.element.classList.remove("hidden") : elem.element.classList.add("hidden")
        }
    }
}
