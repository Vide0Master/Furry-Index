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
        async (usernameinput) => {
            if (usernameinput.length == 0) {
                registerData.error = true
                textInp.displayError(Language.lang.register.username.error.usernameRequired)
                return
            }

            if (usernameinput.length <= 3) {
                registerData.error = true
                textInp.displayError(Language.lang.register.username.error.min + " 3 " + Language.lang.register.username.error.char)
                return
            }

            if (usernameinput.length > 20) {
                registerData.error = true
                textInp.displayError(Language.lang.register.username.error.max + " 20 " + Language.lang.register.username.error.char)
                return
            }

            const capitals = /[A-Z]/
            if (capitals.test(usernameinput)) {
                registerData.error = true
                textInp.displayError(Language.lang.register.username.error.lowecase)
                return
            }

            const restrictedSymbols = /^[a-z0-9-_]+$/
            if (!restrictedSymbols.test(usernameinput)) {
                registerData.error = true
                textInp.displayError(Language.lang.register.username.error.restrictedSymbol)
                return
            }

            const result = await API('GET', `/api/register?username=${usernameinput}`)
            if (result.taken) {
                registerData.error = true
                textInp.displayError(Language.lang.register.username.error.taken)
                return
            }

            registerData.error = false
            textInp.removeError()
            registerData.username = textInp.input.value
        })
    const passFirst = new PasswordInput(Language.lang.register.passFirst.label, container.element, null,
        async (pass) => {
            if (pass.length < 8) {
                registerData.error = true
                passFirst.displayError('Need at least 8 symbols')
                return
            }

            const letters = /[A-Za-z]/
            if (!letters.test(pass)) {
                registerData.error = true
                passFirst.displayError('Needs letters')
                return
            }

            const capitals = /[A-Z]/
            if (!capitals.test(pass)) {
                registerData.error = true
                passFirst.displayError('Needs uppercase symbol')
                return
            }


            const numbers = /[0-9]/
            if (!numbers.test(pass)) {
                registerData.error = true
                passFirst.displayError('Needs numbers')
                return
            }

            const restrictedSymbols = /^[A-Za-z0-9-_+~!@#$%^&*]+$/
            if (!restrictedSymbols.test(pass)) {
                registerData.error = true
                passFirst.displayError('Restricted symbols')
                return
            }

            registerData.error = false
            passFirst.removeError()
        })
    const passSecond = new PasswordInput('Repeat password', container.element, null,
        async (pass) => {
            if (passFirst.input.value != pass) {
                registerData.error = true
                passSecond.displayError('Passwords should match')
                return
            }

            registerData.error = false
            passSecond.removeError()
            registerData.password = pass
        })

    const rememberMe = new SwitchInput('Remember me', container.element, null, false, 'hidden')

    const autologin = new SwitchInput('Login after register', container.element, (value) => {
        rememberMe.element.element.classList.toggle('hidden', !value)
        if (!value) rememberMe.change(false)
    }, false)

    rememberMe.element.moveAfter(autologin.element.element)

    new Button('Register', container.element, null,
        async () => {
            if (registerData.error) {
                new Alert.SimpleAlert('Fix errors in register form', 'Regiter error', 5000, "#ff0000")
                return
            }

            const registerResult = await API('POST', '/api/register', registerData)

            if (registerResult.HTTPCODE == 200) {
                if (autologin.checkbox.element.value) {
                    const loginResult = await API('POST', '/api/login', {
                        login: registerData.username,
                        password: registerData.password,
                        remember: rememberMe.checkbox.element.value,
                    })

                    if (loginResult.HTTPCODE == 200) {
                        new Alert.SimpleAlert(`${Language.lang.login.success[0]} ${loginData.login}`, Language.lang.login.success[1], 5000, '#109f10')
                        await User.updateUserData()
                        UserLabel.checkUserData()
                        Header.checkUserLoginState()
                        Router.navigate('/profile')
                    } else {
                        new Alert.SimpleAlert('Login error', 'Error', 5000, null, 'loginerr')
                    }
                } else {
                    new Alert.SimpleAlert('Profile registered', 'Success', 5000, null, 'registersucc')
                }
            } else {
                new Alert.SimpleAlert('Register error', 'Error', 5000, null, 'registererror')
            }
        })

    return container.element;
}