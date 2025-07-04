import Button from "../../components/button/script.js";
import Elem from "../../components/elem/script.js";
import Header from "../../components/header/script.js";
import UserLabel from "../../elements/userLabel/script.js";
import Alert from "../../features/alert/script.js";
import Language from "../../scripts/language.js";
import Router from "../../scripts/router.js";
import User from "../../scripts/userdata.js";

export const tag = "profile";
export const tagLimit = 5;

export async function render(params) {
    const container = new Elem('profile-container')

    new Elem('text', container.element).text = Language.lang.profile.notImplemented

    if (User.data) {
        new Button(Language.lang.profile.logout, container.element, null, async () => {
            const username = User.data.username
            User.unlogin(async () => {
                Router.navigate('/')
                UserLabel.checkUserData()
                Header.checkUserLoginState()
            })
            new Alert.SimpleAlert(`${Language.lang.profile.loggedOut[0]} ${username} ${Language.lang.profile.loggedOut[1]}`, null, 5000)
        })
    }

    return container.element;
}
