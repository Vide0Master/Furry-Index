import Elem from "../../components/elem/script.js";
import Image from "../../components/image/script.js";
import Link from "../../components/link/script.js";
import Language from "../../scripts/language.js";
import User from "../../scripts/userdata.js";

const container = new Elem('user-label')

const regNloginCont = new Elem(['register-n-login-cont', 'hidden'], container.element)
new Link(Language.lang.header.userCard.login, '/login', regNloginCont.element)
new Link(Language.lang.header.userCard.register, '/register', regNloginCont.element)


const userCont = new Elem(['user-cont', 'hidden'], container.element)
const avatarContainer = new Elem('user-avatar-container', userCont.element)
const userAvatar = new Image('', 'user-avatar', avatarContainer.element)
const userName = new Link('', '/profile', userCont.element, true)

class UserLabel {
    static append(parent) {
        container.append(parent)
        this.checkUserData()
    }

    static checkUserData() {
        if (User.data) {
            this.updateUserData()
            this.showUserData()
            userName.element.href = '/profile/' + User.data.username
        } else {
            this.showLoginRegisterLinks()
        }
    }

    static showLoginRegisterLinks() {
        regNloginCont.element.classList.remove('hidden')
        userCont.element.classList.add('hidden')
    }

    static showUserData() {
        regNloginCont.element.classList.add('hidden')
        userCont.element.classList.remove('hidden')
    }

    static updateUserData() {
        if (User.data.avatar) {
            userAvatar.image.src = `/api/profile/${User.data.username}/avatar?thumbnail=100`
            avatarContainer.element.classList.toggle('hidden', false)
        } else {
            avatarContainer.element.classList.toggle('hidden', true)
        }

        userName.textElem.text = User.data.visiblename != null ? User.data.visiblename : User.data.username
    }
}

export default UserLabel