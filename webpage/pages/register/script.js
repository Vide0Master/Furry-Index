import Button from "../../components/button/script.js";
import Elem from "../../components/elem/script.js";
import PasswordInput from "../../components/passwordinput/script.js";
import SwitchInput from "../../components/switchinput/script.js";
import TextInputLine from "../../components/textinputline/script.js";
import Alert from "../../features/alert/script.js";
import API from "../../scripts/api.js";
import Language from "../../scripts/language.js";
import Router from "../../scripts/router.js";
import User from "../../scripts/userdata.js";
import UserLabel from "../../elements/userLabel/script.js";
import Header from "../../components/header/script.js";
import BasicCheck from "../../scripts/basicChecks.js";
import Overlay from "../../features/overlay/script.js";

export const tag = "register";
export const tagLimit = 1;

export async function render(params) {
    const container = new Elem('register-container')

    const registerData = {
        username: "",
        password: "",
        error: [],
    }

    registerData.error[0] = true
    new Elem('label', container.element).element.innerText = Language.lang.register.label
    const textInp = new TextInputLine(Language.lang.register.username.label, container.element, null, null,
        async (username) => {
            if (username == null) {
                registerData.error[0] = true
                return
            }

            registerData.error[0] = false
            registerData.username = textInp.input.value
        })

    textInp.addCheck(Language.lang.register.username.error.min + " 3 " + Language.lang.register.username.error.chars, (val) => {
        return !BasicCheck.MinLen(val, 3)
    })

    textInp.addCheck(Language.lang.register.username.error.max + " 30 " + Language.lang.register.username.error.chars, (val) => {
        return !BasicCheck.MaxLen(val, 30)
    })

    textInp.addCheck(Language.lang.register.username.error.lowecase, (val) => {
        return !BasicCheck.includesUppercase(val)
    })

    textInp.addCheck(Language.lang.register.username.error.specialSymbolCheck, (val) => {
        const rslt = BasicCheck.getNonLatinChars(val)
        if (rslt.length == 0) {
            return true
        } else {
            return `(${rslt.join(', ')})`
        }
    })

    textInp.addCheck(Language.lang.register.username.error.taken, async (val) => {
        const result = await API('GET', `/api/register?username=${val}`)
        return !result.taken
    })

    registerData.error[1] = true
    const passFirst = new PasswordInput(Language.lang.register.passFirst.label, container.element, null,
        async (pass) => {
            if (pass == null) {
                registerData.error[1] = true
                return
            }

            registerData.error[1] = false
        })

    passFirst.addCheck(Language.lang.register.passFirst.error.min + " 8 " + Language.lang.register.passFirst.error.chars, (val) => {
        return !BasicCheck.MinLen(val, 8)
    })

    passFirst.addCheck(Language.lang.register.passFirst.error.max + " 1000 " + Language.lang.register.passFirst.error.chars, (val) => {
        return !BasicCheck.MaxLen(val, 1000)
    })

    passFirst.addCheck(Language.lang.register.passFirst.error.uppercase, (val) => {
        return BasicCheck.includesUppercase(val)
    })

    passFirst.addCheck(Language.lang.register.passFirst.error.numbers, (val) => {
        return BasicCheck.includesDigit(val)
    })

    registerData.error[2] = true
    const passSecond = new PasswordInput(Language.lang.register.passSecond.label, container.element, null,
        async (pass) => {
            if (pass == null) {
                registerData.error[2] = true
                return
            }

            registerData.error[2] = false
            registerData.password = pass
        })

    passSecond.addCheck(Language.lang.register.passSecond.error.notMatch, (val) => {
        return passFirst.input.value === val
    })

    function processText(text, parent) {
        const elem = new Elem('reg-info-cont', parent)
        for (const textB of text) {
            const block = new Elem('info-block', elem.element)

            if (textB.label) {
                const label = new Elem('label', block.element)
                label.text = textB.label
            }

            if (typeof textB.text === 'string') {
                const text = new Elem('text', block.element)
                text.text = textB.text
            } else if (typeof textB.text === 'object') {
                for (const str of textB.text) {
                    const text = new Elem('text', block.element)
                    text.text = str
                }
            }
        }
        return elem
    }


    registerData.error[3] = true
    const termsOfService = new SwitchInput(Language.lang.register.TOS, container.element, (val) => {
        const overlay = new Overlay()
        const txtElm = processText(Language.lang.TOS, overlay.element)
        const accLine = new Elem(['info-block', 'acc'], txtElm.element)
        new Elem('text', accLine.element).text = Language.lang.register.termsacc.label
        new Button(Language.lang.register.termsacc.no, accLine.element, null, () => {
            termsOfService.change(false)
            registerData.error[3] = true
            overlay.kill()
        })
        new Button(Language.lang.register.termsacc.yes, accLine.element, null, () => {
            termsOfService.change(true)
            registerData.error[3] = false
            overlay.kill()
        })
    }, false, null, false)

    registerData.error[4] = true
    const privacyPolicy = new SwitchInput(Language.lang.register.PP, container.element, (val) => {
        const overlay = new Overlay()
        const txtElm = processText(Language.lang.PP, overlay.element)
        const accLine = new Elem(['info-block', 'acc'], txtElm.element)
        new Elem('text', accLine.element).text = Language.lang.register.termsacc.label
        new Button(Language.lang.register.termsacc.no, accLine.element, null, () => {
            privacyPolicy.change(false)
            registerData.error[4] = true
            overlay.kill()
        })
        new Button(Language.lang.register.termsacc.yes, accLine.element, null, () => {
            privacyPolicy.change(true)
            registerData.error[4] = false
            overlay.kill()
        })
    }, false, null, false)

    const rememberMe = new SwitchInput(Language.lang.register.rememberMe.label, container.element, null, false, 'hidden')

    const autologin = new SwitchInput(Language.lang.register.autologin.label, container.element, (value) => {
        rememberMe.element.classList.toggle('hidden', !value)
        if (!value) rememberMe.change(false)
    }, false)

    rememberMe.moveAfter(autologin.element)

    new Button(Language.lang.register.label, container.element, null,
        async () => {
            if (registerData.error.includes(true)) {
                new Alert.Simple(Language.lang.register.error.fixForm, Language.lang.register.error.title, 5000, "#ff0000")
                return
            } else {
                registerData.error = false
            }

            const registerResult = await API('POST', '/api/register', registerData)

            if (registerResult.HTTPCODE == 200) {
                if (autologin.checkbox.checked) {
                    const loginResult = await API('POST', '/api/login', {
                        login: registerData.username,
                        password: registerData.password,
                        remember: rememberMe.checkbox.checked,
                    })

                    if (loginResult.HTTPCODE == 200) {
                        await User.updateUserData()
                        new Alert.Simple(`${Language.lang.login.success[0]} ${User.data.visiblename ? User.data.visiblename : User.data.username}`, Language.lang.login.success[1], 5000, '#109f10')
                        UserLabel.checkUserData()
                        Header.checkUserLoginState()
                        Router.navigate(`/profile/${User.data.username}`)
                    } else {
                        new Alert.Simple(Language.lang.login.error.title, Language.lang.login.error.message, 5000, null, 'loginerr')
                    }
                } else {
                    new Alert.Simple(Language.lang.register.success[0], Language.lang.register.success[1], 5000, null, 'registersucc')
                }
            } else {
                new Alert.Simple(Language.lang.register.error.title, Language.lang.register.error.message, 5000, null, 'registererror')
            }
        })

    return container.element;
}