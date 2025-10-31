import Button from "../../components/button/script.js";
import Header from "../../components/header/script.js";
import UserLabel from "../../elements/userLabel/script.js";
import Alert from "../../features/alert/script.js";
import Router from "../../scripts/router.js";
import User from "../../scripts/userdata.js";
import DropdownList from "../../components/dropdownList/script.js";
import Elem from "../../components/elem/script.js";
import Language from "../../scripts/language.js";
import Overlay from "../../features/overlay/script.js";
import API from "../../scripts/api.js";
import FileCard from "../../elements/fileCard/script.js";
import TextInputLine from "../../components/textinputline/script.js";
import Link from "../../components/link/script.js";
import SwitchInput from "../../components/switchinput/script.js";
import Theme from "../../scripts/themeController.js";
import PasswordInput from "../../components/passwordinput/script.js";
import BasicCheck from "../../scripts/basicChecks.js";
import TextLabel from "../../elements/textLabel/script.js";

export const tag = "settings";
export const tagLimit = 1;
export const titleID = tag

export async function render(params) {
    const container = new Elem("settings-container")

    const pages = {}

    const settingsRow = new Elem("settings-selector-row", container.element)
    new Elem("label", settingsRow.element).text = Language.lang.settings.label

    const ddlist = new DropdownList([
        {
            name: Language.lang.settings.typeSwitch.webpage,
            value: "webpage",
            selected: true
        },
        {
            name: Language.lang.settings.typeSwitch.user,
            value: "user"
        }
    ], settingsRow.element, Language.lang.settings.typeSwitch.placeholder, (value) => {
        for (const page in pages) {
            if (pages[page].element && value == page) {
                pages[page].element.classList.toggle("hidden", false)
            } else {
                pages[page].element.classList.toggle("hidden", true)
            }
        }
    });

    if (!User.data) { ddlist.element.classList.add("hidden"); }

    //region Webpage Settings
    pages.webpage = new Elem("webpage-settings", container.element);

    //region language
    new DropdownList(
        Language.availableLanguages.map((k) => ({
            name: Language.lang.settings.webpage.language[k],
            value: k,
            selected: Language.currentLang == k
        })),
        pages.webpage.element, Language.lang.settings.webpage.language.label, (val) => {
            Language.setLanguage(val)
        }, Language.lang.settings.webpage.language.label + ": ")

    //region themes
    const themesList = ["default-dark", "nature", "blueberry", "bloody-mary"]
    const themes = new DropdownList(themesList.map(v => {
        return {
            name: Language.lang.settings.webpage.theme.themes[v],
            value: v
        }
    }), pages.webpage.element, Language.lang.settings.webpage.theme.label, (v) => {
        Theme.set(v)
    }, Language.lang.settings.webpage.theme.label + ": ")

    const currentTheme = User.Settings.get("theme", "p")
    if (currentTheme) themes.selectOption(currentTheme)

    Array.from(themes.optionsBlock.e.children).forEach((elem, i) => {
        elem.classList.add("theme-" + themesList[i])
    })

    //region item counts for posts
    const itemCounts = [25, 50, 75, 100, 150, 200]
    new DropdownList(itemCounts.map((v) => ({
        name: v,
        value: v,
        selected: User.Settings.get("postsPerPage", "p") == v
    })),
        pages.webpage.element, null, (v) => {
            User.Settings.set("postsPerPage", v, "p")
        },
        `${Language.lang.settings.webpage.postsPerPage}: `
    )

    //region content filters
    const contentFilters = new Elem("content-filter-cont", pages.webpage.element);
    new Elem("label", contentFilters.element).text = Language.lang.settings.webpage.contentFilters.label

    const userContentSettings = User.Settings.get("contentFiler", "p")

    function updateContentFilter(type, mode, value) {
        const settings = User.Settings.get("contentFiler", "p")
        settings[type][mode] = value
        User.Settings.set("contentFiler", settings, "p")
    }

    const filterTypes = ["safe", "questionable", "explicit"]

    filterTypes.forEach(type => {
        const row = new Elem("rating-row", contentFilters.element)
        new Elem("label", row.element).text = Language.lang.settings.webpage.contentFilters.labels[type]

        new SwitchInput(Language.lang.settings.webpage.contentFilters.show, row.element, (v) => {
            updateContentFilter(type, "show", v)
            blurInput.switchVisible(v)
        }, userContentSettings[type].show)

        const blurInput = new SwitchInput(Language.lang.settings.webpage.contentFilters.blur, row.element, (v) => {
            updateContentFilter(type, "blur", v)
        }, userContentSettings[type].blur)

        if (!userContentSettings[type].show) {
            blurInput.switchVisible(false)
        }
    });


    //region User Settings
    if (User.data) {
        pages.user = new Elem(["user-settings", "hidden"], container.element)

        //region logout
        new Button(`${Language.lang.settings.user.logout} ${User.data.username}`, pages.user.element, null, async () => {
            const username = User.data.username
            User.unlogin(async () => {
                Router.navigate("/")
                UserLabel.checkUserData()
                Header.checkUserLoginState()
            })
            new Alert.Simple(`${Language.lang.settings.user.loggedOut[0]} ${username} ${Language.lang.settings.user.loggedOut[1]}`, null, 5000)
        })

        //region updatePassword
        new Button(Language.lang.settings.user.changePass.label, pages.user.element, null, async () => {
            const pwChangeAlert = new Alert.Simple(null, Language.lang.settings.user.changePass.label, null, null, "changePass")
            pwChangeAlert.okButton.kill()

            let checkErrors

            const newPass = new PasswordInput(Language.lang.settings.user.changePass.newPass, pwChangeAlert.alertCont.element, null, () => { checkErrors() })

            newPass.addCheck(Language.lang.register.passFirst.error.min + " 8 " + Language.lang.register.passFirst.error.chars, (val) => {
                return !BasicCheck.MinLen(val, 8)
            })

            newPass.addCheck(Language.lang.register.passFirst.error.max + " 1000 " + Language.lang.register.passFirst.error.chars, (val) => {
                return !BasicCheck.MaxLen(val, 1000)
            })

            newPass.addCheck(Language.lang.register.passFirst.error.uppercase, (val) => {
                return BasicCheck.includesUppercase(val)
            })

            newPass.addCheck(Language.lang.register.passFirst.error.numbers, (val) => {
                return BasicCheck.includesDigit(val)
            })

            const repNewPass = new PasswordInput(Language.lang.settings.user.changePass.repNewPass, pwChangeAlert.alertCont.element, null, () => { checkErrors() })

            repNewPass.addCheck({ default: Language.lang.register.passSecond.notMatch, ok: Language.lang.register.passSecond.match, nok: Language.lang.register.passSecond.notMatch }, (val) => {
                return newPass.value === val
            })

            const btnRow = new Elem("pass-change-row", pwChangeAlert.alertCont.element)

            const changeBtn = new Button(Language.lang.settings.user.changePass.change, btnRow.element, null, async () => {
                if (newPass.checksInf.errAny || repNewPass.checksInf.errAny) return
                const resp = await API("put", `/api/profile/${User.data.username}`, { password: repNewPass.value })
                if (resp.HTTPCODE === 200) {
                    pwChangeAlert.removeAlert()
                    new Alert.Simple(Language.lang.settings.user.changePass.succ.text, Language.lang.settings.user.changePass.succ.title, 5000, null, "passChangeSucc")
                } else { /* empty */ }
            })
            changeBtn.enabled = false

            checkErrors = () => {
                changeBtn.enabled = newPass.checksInf.okAll && repNewPass.checksInf.okAll
            }

            new Button(Language.lang.settings.user.changePass.cancel, btnRow.element, null, () => {
                pwChangeAlert.removeAlert()
            })
        })

        //region avatar control
        const avatarLine = new Elem("avatar-line", pages.user.element)

        const rmAvatar = new Button(Language.lang.settings.user.removeAvatar, avatarLine.element, null, async () => {
            new Alert.Confirm(Language.lang.settings.user.removeAvatarAlert, null, async () => {
                const rmResult = await API("DELETE", `/api/profile/${User.data.username}`, { avatarID: true })
                if (rmResult.HTTPCODE == 200) {
                    await User.updateUserData()
                    UserLabel.checkUserData()
                    rmAvatar.switchVisible(false)
                    avatarShapeDD.switchVisible(false)
                }
            })
        })
        if (!User.data.avatar) rmAvatar.element.classList.toggle("hidden", true)

        const selAvatar = new Button(Language.lang.settings.user.selectAvatar, avatarLine.element, null, async () => {
            const overlay = new Overlay()
            const avatarSelector = new Elem("avatar-selector", overlay.element)
            const files = await API("GET", "/api/files?inuse=false&tags=image&t=5")
            new Elem("label", avatarSelector.element).text = Language.lang.settings.user.selectAvatar
            const fileList = new Elem("file-list", avatarSelector.element)
            for (const file of files.files) {
                const fileElem = new FileCard(file, false, fileList.element, { remove: false, avatar: false })
                new Button(Language.lang.settings.user.selectBtn, fileElem.element, null, async () => {
                    const avatarSetResult = await API("PUT", `/api/profile/${User.data.username}`, { avatarID: file.id })
                    if (avatarSetResult.HTTPCODE == 200) {
                        overlay.close()
                        await User.updateUserData()
                        UserLabel.checkUserData()
                        rmAvatar.switchVisible(true)
                        avatarShapeDD.switchVisible(true)
                    }
                })
            }

            if (files.files.length == 0) {
                const noFilesLabel = new Elem("no-files-label", avatarSelector.element)
                new Elem(null, noFilesLabel.element).text = Language.lang.settings.user.noAvatarFiles
                new Link(Language.lang.settings.user.uploadFile, "/upload", noFilesLabel.element, true, null, "upload")
            }
        })
        rmAvatar.moveAfter(selAvatar.element)

        //region select avatar type

        const currentShape = User.Settings.get("avatarShape", "g")
        const avatarTypes = ["square", "round", "portrait", "landscape"]

        const avatarShapeDD = new DropdownList(avatarTypes.map(v => {
            return {
                name: Language.lang.settings.user.avatarType.shapes[v],
                value: v,
                selected: v == currentShape
            }
        }), avatarLine.element, Language.lang.settings.user.avatarType.label, (v) => {
            User.Settings.set("avatarShape", v, "g")
            UserLabel.setAvatarShape(v)
        }, Language.lang.settings.user.avatarType.label + ": ")

        if (!User.data.avatarID) avatarShapeDD.switchVisible(false)

        //region visible name
        const visibleNameLine = new Elem("visible-name-cont", pages.user.element)
        const txtField = new TextInputLine(Language.lang.settings.user.visibleName.label, visibleNameLine.element)
        if (User.data.visiblename) txtField.value = User.data.visiblename

        const removeVisibleNameBtn = new Button(Language.lang.settings.user.visibleName.rmBtn, visibleNameLine.element, null, async () => {
            const reqResult = await API("DELETE", `/api/profile/${User.data.username}`, { visiblename: true })
            if (reqResult.HTTPCODE == 200) {
                new Alert.Simple(Language.lang.settings.user.visibleName.result.rmsucc, null, 5000, null, "usernmset")
                await User.updateUserData()
                UserLabel.updateUserData()
                txtField.value = ""
                removeVisibleNameBtn.switchVisible(false)
            }
        })
        removeVisibleNameBtn.switchVisible(!!User.data.visiblename)

        const setVisibleNameBtn = new Button(Language.lang.settings.user.visibleName.setBtn, visibleNameLine.element, null, async () => {
            const reqResult = await API("PUT", `/api/profile/${User.data.username}`, { visiblename: txtField.value })
            if (reqResult.HTTPCODE == 200) {
                new Alert.Simple(Language.lang.settings.user.visibleName.result.setsucc, null, 5000, null, "usernmset")
                await User.updateUserData()
                UserLabel.updateUserData()
                removeVisibleNameBtn.switchVisible(true)
            }
        })

        removeVisibleNameBtn.moveAfter(setVisibleNameBtn.element)

        //region item counts for files
        // yes, i did not made another variable for this shit
        // why shoud i duplicate varibles with same purpose of counting items on page?!
        new DropdownList(itemCounts.map((v) => ({
            name: v,
            value: v,
            selected: User.Settings.get("filesPerPage", "p") == v
        })),
            pages.user.element, null, (v) => {
                User.Settings.set("filesPerPage", v, "p")
            },
            `${Language.lang.settings.user.filesPerPage}: `
        )

        //region email
        const linkedEmail = new Elem("email-link", pages.user)
        const emailStatus = new TextLabel(".", linkedEmail)

        const emailLinkPending = new Elem("email-link-pending", linkedEmail)
        const emailField = new TextInputLine(Language.lang.settings.user.email.input, emailLinkPending)
        new Button(Language.lang.settings.user.email.linkLabel, emailLinkPending, null, async () => {
            const resp = await API("post", `/api/profile/${User.data.username}/email`, { email: emailField.value })
            if (resp.HTTPCODE === 200) {
                new Alert.Simple(`${Language.lang.settings.user.email.msgAlert[1]}\n${Language.lang.settings.user.email.msgAlert[2]}`, Language.lang.settings.user.email.msgAlert[0], 0, null, "email-verify")
            } else {
                new Alert.Simple(Language.lang.features.alert.err.tryAgainLater.text, Language.lang.features.alert.err.tryAgainLater.title, 5000, null, "msg-error")
            }
        })

        const unlinkBtn = new Button(Language.lang.settings.user.email.unlink, linkedEmail, null, async () => {
            const reqResult = await API("delete", `/api/profile/${User.data.username}`, { email: true })
            if (reqResult.HTTPCODE === 200) {
                new Alert.Simple(Language.lang.settings.user.email.unlinked, null, 5000, null, "email-unlink")

                emailStatus.text = Language.lang.settings.user.email.link.noLink
                emailStatus.setColor("var(--nok-color)")
                emailLinkPending.switchVisible(true)
                unlinkBtn.switchVisible(false)
            } else {
                new Alert.Simple(Language.lang.features.aler.err.tryAgainLater.text, Language.lang.features.aler.err.tryAgainLater.title, 5000, null, "msg-error")
            }
        })

        if (User.data.email) {
            emailStatus.text = Language.lang.settings.user.email.link.link + ": " + User.data.email
            emailStatus.setColor("var(--ok-color)")
            emailLinkPending.switchVisible(false)
        } else {
            emailStatus.text = Language.lang.settings.user.email.link.noLink
            emailStatus.setColor("var(--nok-color)")
            unlinkBtn.switchVisible(false)
        }

    }

    if (["webpage", "user"].includes(params?.query?.t)) ddlist.selectOption(params?.query?.t)

    return container.element;
}

