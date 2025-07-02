import Button from "../../components/button/script.js";
import Elem from "../../components/elem/script.js";
import Header from "../../components/header/script.js";
import UserLabel from "../../elements/userLabel/script.js";
import Alert from "../../features/alert/script.js";
import Router from "../../scripts/router.js";
import User from "../../scripts/userdata.js";

export const tag = "profile";
export const tagLimit = 5;

export async function render(params) {
    const container = new Elem('profile-container')

    new Elem('text', container.element).text = 'Not implemented'

    if (User.data) {
        new Button('Unlogin', container.element, null, async () => {
            const username = User.data.username
            User.unlogin(async () => {
                Router.navigate('/')
                UserLabel.checkUserData()
                Header.checkUserLoginState()
            })
            new Alert.SimpleAlert(`Logged out from ${username}`, 'Success', 5000)
        })
    }

    return container.element;
}
