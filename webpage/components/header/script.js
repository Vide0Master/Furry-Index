import Elem from "../elem/script.js"
import Link from "../link/script.js"
import UserLabel from "../../elements/userLabel/script.js"
import Language from "../../scripts/language.js"
import User from "../../scripts/userdata.js"
import Icon from "../icon/script.js"
import DropdownList from "../dropdownList/script.js"
import Router from "../../scripts/router.js"

export default class Header {
    static render() {
        const body = document.querySelector("body")
        this.element = document.createElement("header")
        body.appendChild(this.element)

        const listDisp = new Elem("burger-menu-button", this.element)
        new Icon("list", listDisp.element)

        const navRow = new Elem("nav-row", this.element, "nav")

        listDisp.addEvent("click", () => {
            navRow.element.classList.toggle("open", true)
        })

        document.addEventListener("click", (e) => {
            if (!navRow.element.contains(e.target) && !listDisp.element.contains(e.target)) {
                navRow.element.classList.toggle("open", false)
            }
        })

        Router.regNavListener(() => {
            navRow.element.classList.toggle("open", false)
        }, true)

        this.main = new Link(Language.lang.header.main, "/", navRow.element)
        this.search = new Link(Language.lang.header.search, "/search", navRow.element, true, null, "search")
        this.news = new Link(Language.lang.header.news, "/news", navRow.element, true, null, "list")
        this.settings = new Link(Language.lang.header.settings, "/settings", navRow.element, true, null, "settings")

        this.content = new DropdownList([
            { name: "✦ " + Language.lang.header.content.postMaster, value: "link:/post-master" },
            { name: Language.lang.header.content.upload, value: "link:/upload", icon: "upload" },
            { name: Language.lang.header.content.fileManager, value: "link:/file-manager", icon: "file" }
        ], navRow.element, "✦ " + Language.lang.header.content.label, null, null)
        this.content.icon.kill()

        const adminPages = []
        if (User.testUserPermission("admin:news")) adminPages.push({ name: Language.lang.header.admin.news, value: "link:/admin/news" })
        if (User.testUserPermission("admin:appeals")) adminPages.push({ name: Language.lang.header.admin.appeals, value: "link:/admin/appeals" })
        if (User.testUserPermission("admin:users")) adminPages.push({ name: Language.lang.header.admin.users, value: "link:/admin/users" })

        this.adminPanel = new DropdownList(adminPages, navRow.element, Language.lang.header.admin.label, null, null)

        this.adminPanel.icon.iconName = "shield"

        Router.regNavListener((route) => {
            if (!this.adminPanel.options.some(v => v.value == route)) this.adminPanel.selectOption("placeholder")
        }, true)

        UserLabel.append(this.element)

        this.checkUserLoginState()
    }

    static checkUserLoginState() {
        this.showLoggenInOptions(!!User.data)
        this.showAdminOptions(User.testUserPermission("admin", false))
    }

    static showLoggenInOptions(state) {
        const loggenInOptions = [this.content]

        for (const elem of loggenInOptions) {
            state ? elem.element.classList.remove("hidden") : elem.element.classList.add("hidden")
        }
    }

    static showAdminOptions(state) {
        const loggenInOptions = [this.adminPanel]

        for (const elem of loggenInOptions) {
            state ? elem.element.classList.remove("hidden") : elem.element.classList.add("hidden")
        }
    }
}
