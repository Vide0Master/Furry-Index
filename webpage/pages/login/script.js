import Button from "../../components/button/script.js";
import Elem from "../../components/elem/script.js";
import Header from "../../components/header/script.js";
import PasswordInput from "../../components/passwordinput/script.js";
import SwitchInput from "../../components/switchinput/script.js";
import TextInputLine from "../../components/textinputline/script.js";
import UserLabel from "../../elements/userLabel/script.js";
import Alert from "../../features/alert/script.js";
import API from "../../scripts/api.js";
import BasicCheck from "../../scripts/basicChecks.js";
import Language from "../../scripts/language.js";
import Router from "../../scripts/router.js";
import User from "../../scripts/userdata.js";

export const tag = "login";
export const tagLimit = 1;

export async function render(params) {
    const container = new Elem('login-container')

    const loginData = {
        login: '',
        password: '',
        remember: true,
        error: false
    }

    new Elem('label', container.element).element.innerText = Language.lang.login.mainLabel

    const login = new TextInputLine(Language.lang.login.fields.username, container.element, null, 'text', async (value) => {
        loginData.login = value
        login.removeError()
    })

    const pass = new PasswordInput(Language.lang.login.fields.password, container.element, null, async (value) => {
        loginData.password = value
        pass.removeError()
    })

    const rememberMe = new SwitchInput(Language.lang.login.fields.keepmeloggedin, container.element, (state) => {
        loginData.remember = state
    }, true)

    new Button('Log in', container.element, null, async () => {
        const loginResult = await API('POST', '/api/login', loginData)
        switch (loginResult.HTTPCODE) {
            case 404: {
                login.displayError(Language.lang.login.errors.wrongUsername)
            }; break;
            case 401: {
                pass.displayError(Language.lang.login.errors.wrondPassword)
            }; break;
            case 200: {
                new Alert.SimpleAlert(`${Language.lang.login.success[0]} ${loginData.login}`, Language.lang.login.success[1], 5000, '#109f10')
                await User.updateUserData()
                UserLabel.checkUserData()
                Header.checkUserLoginState()
                Router.navigate('/profile')
            }; break
        }
    })

    return container.element;
}
