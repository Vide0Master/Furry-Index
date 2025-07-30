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

export const tag = "register";
export const tagLimit = 1;

export async function render(params) {
    const container = new Elem('register-container')

    const registerData = {
        username: "",
        password: "",
        error: true,
    }

    new Elem('label', container.element).element.innerText = Language.lang.register.label
    const textInp = new TextInputLine(Language.lang.register.username.label, container.element, null, null,
        async (username) => {
            if (username == null) {
                registerData.error = true
                return
            }

            registerData.error = false
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

    const passFirst = new PasswordInput(Language.lang.register.passFirst.label, container.element, null,
        async (pass) => {
            if (pass == null) {
                registerData.error = true
                return
            }

            registerData.error = false
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

    const passSecond = new PasswordInput(Language.lang.register.passSecond.label, container.element, null,
        async (pass) => {
            if (pass == null) {
                registerData.error = true
                return
            }

            registerData.error = false
            registerData.password = pass
        })

    passSecond.addCheck(Language.lang.register.passSecond.error.notMatch, (val) => {
        return passFirst.input.value === val
    })

    const rememberMe = new SwitchInput(Language.lang.register.rememberMe.label, container.element, null, false, 'hidden')

    const autologin = new SwitchInput(Language.lang.register.autologin.label, container.element, (value) => {
        rememberMe.element.classList.toggle('hidden', !value)
        if (!value) rememberMe.change(false)
    }, false)

    rememberMe.moveAfter(autologin.element)

    new Button(Language.lang.register.label, container.element, null,
        async () => {
            if (registerData.error) {
                new Alert.Simple(Language.lang.register.error.fixForm, Language.lang.register.error.title, 5000, "#ff0000")
                return
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