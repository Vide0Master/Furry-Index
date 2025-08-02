import Elem from '../elem/script.js'
import Link from '../link/script.js'
import UserLabel from '../../elements/userLabel/script.js'
import lang from '../../languages/ENG.js'
import Language from '../../scripts/language.js'
import User from '../../scripts/userdata.js'
import Icon from '../icon/script.js'

export default class Header {
    static render() {
        const body = document.querySelector('body')
        this.element = document.createElement('header')
        body.appendChild(this.element)

        const listDisp = new Elem('burger-menu-button', this.element)
        const listDispIcon = new Icon('list', listDisp.element)

        const navRow = new Elem('nav-row', this.element, 'nav')

        listDisp.addEvent('click', () => {
            navRow.element.classList.toggle('open', true)
        })

        navRow.addEvent('click', () => {
            navRow.element.classList.toggle('open', false)
        })

        document.addEventListener('click', (e) => {
            if (![navRow.element, listDisp.element, listDispIcon.element].includes(e.target)) {
                navRow.element.classList.toggle('open', false)
            }
        })

        this.main = new Link(Language.lang.header.main, '/', navRow.element)
        this.search = new Link(Language.lang.header.search, '/search', navRow.element, true, null, 'search')
        this.settings = new Link(Language.lang.header.settings, '/settings', navRow.element, true, null, 'settings')
        this.upload = new Link(Language.lang.header.upload, '/upload', navRow.element, true, 'hidden', 'upload')
        this.fileManager = new Link(Language.lang.header.fileManager, '/file-manager', navRow.element, true, 'hidden', 'file')
        this.postMaster = new Link('✦ ' + Language.lang.header.postMaster, '/post-master', navRow.element, true)

        UserLabel.append(this.element)

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
