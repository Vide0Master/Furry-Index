import User from "./userdata.js"

const body = document.body

export default class Theme {
    static set(name) {
        body.classList.forEach(cls => {
            if (cls.startsWith("theme-")) {
                body.classList.remove(cls)
            }
        })

        body.classList.add(`theme-${name}`)
        User.Settings.set("theme", name, "p")
    }
}

const currentTheme = User.Settings.get("theme", "p")
Theme.set(currentTheme ? currentTheme : User.Settings.default.privateprofileparams.theme)
