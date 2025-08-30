import Elem from "../../components/elem/script.js"
import Image from "../../components/image/script.js"
import Link from "../../components/link/script.js"

export default class UserCard extends Elem {
    constructor(parent, userData, cardType = 'default') {
        super('internal-user-card', parent)

        console.log(userData)

        if (userData.avatarID) {
            const avatarCont = new Elem('avatar-cont', this.element)
            const avatarBorder = new Elem('avatar-border', avatarCont.element)
            const avatar = new Image(`/api/profile/${userData.username}/avatar?thumbnail=300`, 'user-avatar', avatarBorder.element)
        }

        const sideBlock = new Elem('side-block', this.element)

        if (userData.visiblename) {
            new Elem(null, sideBlock.element).text = userData.visiblename
        }

        new Link(`@${userData.username}`, `/profile/${userData.username}`, sideBlock.element, true, 'user-link')
    }
}