import Button from "../../components/button/script.js";
import Elem from "../../components/elem/script.js";
import Header from "../../components/header/script.js";
import Link from "../../components/link/script.js";
import PasswordInput from "../../components/passwordinput/script.js";
import SwitchInput from "../../components/switchinput/script.js";
import TextInputLine from "../../components/textinputline/script.js";
import UserLabel from "../../elements/userLabel/script.js";
import Alert from "../../features/alert/script.js";
import Overlay from "../../features/overlay/script.js";
import API from "../../scripts/api.js";
import Language from "../../scripts/language.js";
import Router from "../../scripts/router.js";
import User from "../../scripts/userdata.js";

export const tag = "login";
export const tagLimit = 1;
export const titleID = tag

export async function render() {
    const container = new Elem("login-container")

    const loginData = {
        login: "",
        password: "",
        remember: true,
        error: false
    }

    new Elem("label", container.element).element.innerText = Language.lang.login.mainLabel

    new TextInputLine(Language.lang.login.fields.username, container.element, null, "text", async (value) => {
        loginData.login = value
    }, null)

    new PasswordInput(Language.lang.login.fields.password, container.element, null, async (value) => {
        loginData.password = value
    })

    new Link(Language.lang.login.pwdReset.label, () => {
        const overlay = new Overlay({ closeOnClick: false })
        const pwdResetCont = new Elem("password-reset-cont", overlay)

        new Elem("label", pwdResetCont).text = Language.lang.login.pwdReset.label
        new Elem("desc", pwdResetCont).text = Language.lang.login.pwdReset.desc

        const emailLine = new TextInputLine("Email", pwdResetCont, null, "default")

        const btnRow = new Elem("btn-row", pwdResetCont)
        new Button(Language.lang.login.pwdReset.send, btnRow, null, async () => {
            if (emailLine.value.length < 3) {
                new Alert.Simple(Language.lang.login.pwdReset.emailShort, Language.lang.features.alert.error, 5000, null, "shortEmail")
                return
            }
            const resp = await API("post", "/api/users/password-reset", { email: emailLine.value })
            if (resp.HTTPCODE == 200) {
                new Alert.Simple(Language.lang.login.pwdReset.sent, Language.lang.features.alert.succ)
            } else if (resp.HTTPCODE == 404) {
                new Alert.Simple(Language.lang.login.pwdReset.notLinked, Language.lang.features.alert.error, 5000, null, "msg-error")
            } else {
                new Alert.Simple(Language.lang.features.alert.err.tryAgainLater.text, Language.lang.features.alert.err.tryAgainLater.title, 5000, null, "msg-error")
            }
        })
        new Button(Language.lang.def.cancel, btnRow, null, () => { overlay.close() })
    }, container, null, null, "key")

    new SwitchInput(Language.lang.login.fields.keepmeloggedin, container.element, (state) => {
        loginData.remember = state
    }, true)

    new Button(Language.lang.login.button, container.element, null, async () => {
        const loginResult = await API("POST", "/api/login", loginData)
        switch (loginResult.HTTPCODE) {
            case 404: {
                new Alert.Simple(Language.lang.login.errors.wrongUsername, null, null, null, "wrongUname")
            }; break;
            case 401: {
                new Alert.Simple(Language.lang.login.errors.wrondPassword, null, null, null, "wrongPass")
            }; break;
            case 200: {
                await User.updateUserData()
                new Alert.Simple(`${Language.lang.login.success[0]} ${User.data.visiblename ? User.data.visiblename : User.data.username}`, Language.lang.login.success[1], 5000, "#109f10")
                UserLabel.checkUserData()
                Header.checkUserLoginState()
                Router.navigate(`/profile/${User.data.username}`)
            }; break
        }
    })

    return container.element;
}
