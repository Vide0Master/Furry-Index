import Elem from "../../components/elem/script.js"
import Image from "../../components/image/script.js"
import Link from "../../components/link/script.js"
import RoleLabel from "../roleLabel/script.js"

export default class UserCard extends Elem {
    constructor(parent, userData, cardType = "default", features = []) {
        super("internal-user-card", parent)

        if (!["default", "messageHeader"].includes(cardType)) return

        if (userData.avatarID) {
            const avatarCont = new Elem("avatar-cont", this.element)
            if (userData?.globalprofileparams?.avatarShape) {
                avatarCont.addClass(`shape-${userData?.globalprofileparams?.avatarShape}`)
            }
            const avatarBorder = new Elem("avatar-border", avatarCont.element)
            new Image(`/api/profile/${userData.username}/avatar?thumbnail=300`, "user-avatar", avatarBorder.element)
        }

        const sideBlock = new Elem("side-block", this.element)

        switch (cardType) {
            case "messageHeader": {
                this.addClass("message-header")
                new Link(userData.visiblename ? userData.visiblename : `@${userData.username}`, `/profile/${userData.username}`, sideBlock.element, true, "user-link")
            }; break;
            default: {
                if (features.includes("shrinkName")) {
                    new Link(userData.visiblename ? userData.visiblename : `@${userData.username}`, `/profile/${userData.username}`, sideBlock.element, true)
                } else {
                    if (userData.visiblename) {
                        new Elem(null, sideBlock.element).text = userData.visiblename
                    }
                    new Link(`@${userData.username}`, `/profile/${userData.username}`, sideBlock.element, true, "user-link")
                }
            }; break;
        }

        for (const role of userData.roles) {
            new RoleLabel(role, sideBlock.element, ["messageHeader"].includes(cardType))
        }
    }
}