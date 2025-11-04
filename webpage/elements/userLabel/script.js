import Elem from "../../components/elem/script.js";
import Image from "../../components/image/script.js";
import Link from "../../components/link/script.js";
import Language from "../../scripts/language.js";
import User from "../../scripts/userdata.js";
import RoleLabel from "../roleLabel/script.js";

const container = new Elem("user-label")

const regNloginCont = new Elem(["register-n-login-cont", "hidden"], container.element)
new Link(Language.lang.header.userCard.login, "/login", regNloginCont.element)
new Link(Language.lang.header.userCard.register, "/register", regNloginCont.element)


const userCont = new Link(null, "/profile", container.element, true, ["user-cont", "hidden"])
userCont.textElem.element.remove()
const avatarContainer = new Elem("user-avatar-container", userCont.element)
const userAvatar = new Image("", "user-avatar", avatarContainer.element)
const userContData = new Elem("user-data", userCont)
const userNameLine = new Elem("user-name-line", userContData)
const userName = new Elem("user-name", userNameLine)
const userRoles = new Elem("user-roles", userContData)
userRoles.switchVisible(false)

const verifiedIcon = new Elem("verified-icon", userNameLine)
for (let i = 0; i < 4; i++) {
    new Elem("ln", verifiedIcon).setStyleProperty("--rotation", `${i * 45}deg`)
}
new Elem("check", verifiedIcon).text = "✓"
verifiedIcon.title = Language.lang.elements.userCard.verified
verifiedIcon.switchVisible(false)

class UserLabel {
    static append(parent) {
        container.append(parent)
        this.checkUserData()
    }

    static checkUserData() {
        if (User.data) {
            this.updateUserData()
            this.showUserData()
            this.updateUserRoles()
            userCont.element.href = "/profile/" + User.data.username
        } else {
            this.showLoginRegisterLinks()
        }
    }

    static showLoginRegisterLinks() {
        regNloginCont.element.classList.remove("hidden")
        userCont.element.classList.add("hidden")
    }

    static showUserData() {
        regNloginCont.element.classList.add("hidden")
        userCont.element.classList.remove("hidden")
    }

    static updateUserRoles() {
        userRoles.wipe()
        verifiedIcon.switchVisible(false)
        if (User?.data?.roles) {
            userRoles.switchVisible(true)
            for (const role of User.data.roles) {
                if (role.type == "verifiedUser") {
                    verifiedIcon.switchVisible(true)
                } else {
                    new RoleLabel(role, userRoles, true)
                }
            }
        } else {
            userRoles.switchVisible(false)
        }
    }

    static updateUserData() {
        if (User.data.avatar) {
            userAvatar.image.src = `/api/profile/${User.data.username}/avatar?thumbnail=100?cacheBust=${Date.now()}`
            avatarContainer.switchVisible(true)
            this.setAvatarShape(User.Settings.get("avatarShape", "g"))
        } else {
            avatarContainer.switchVisible(false)
        }

        userName.text = User.data.visiblename != null ? User.data.visiblename : User.data.username
    }

    static setAvatarShape(shape) {
        if (User.data.avatarID && shape) {
            avatarContainer.rmClass(/^shape-/)
            avatarContainer.addClass(`shape-${shape}`)
        }
    }
}

export default UserLabel