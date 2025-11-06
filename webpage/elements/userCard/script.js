import DropdownList from "../../components/dropdownList/script.js"
import Elem from "../../components/elem/script.js"
import Image from "../../components/image/script.js"
import Link from "../../components/link/script.js"
import Alert from "../../features/alert/script.js"
import API from "../../scripts/api.js"
import Language from "../../scripts/language.js"
import User from "../../scripts/userdata.js"
import RoleLabel from "../roleLabel/script.js"
import TextLabel from "../textLabel/script.js"

export default class UserCard extends Elem {
    constructor(parent, userData, cardType = "default", features = { shrinkName: false, roleEdit: false, shrinkRoles: false }) {
        super("internal-user-card", parent)

        if (!["default", "avatarOnly", "usernameOnly"].includes(cardType)) return

        const showAvatar = !!userData?.avatarID && cardType !== "usernameOnly"
        const showNameBlock = cardType !== "avatarOnly"
        const isUsernameOnly = cardType === "usernameOnly"
        const isAvatarOnly = cardType === "avatarOnly"

        if (userData?.globalprofileparams?.avatarShape && !isUsernameOnly) {
            this.addClass(`shape-${userData.globalprofileparams.avatarShape}`)
        }

        if (showAvatar) {
            const avatarCont = new Link(null, `/profile/${userData.username}`, this, true, "avatar-cont")
            const avatarBorder = new Elem("avatar-border", avatarCont.element)
            new Image(`/api/profile/${userData.username}/avatar?thumbnail=300`, "user-avatar", avatarBorder.element)
        }

        if (!showNameBlock) return

        this.sideBlock = new Elem("side-block", this.element)
        this.userNameLine = new Elem("user-name-line", this.sideBlock)

        if (isUsernameOnly) {
            this.addClass("username-only")
            new Link(userData.visiblename ?? `@${userData.username}`, `/profile/${userData.username}`, this.userNameLine, true)
        } else if (cardType === "avatarOnly") {
            this.addClass("avatar-only")
        } else { 
            if (features.shrinkName) {
                new Link(userData.visiblename ?? `@${userData.username}`, `/profile/${userData.username}`, this.userNameLine, true)
            } else {
                if (userData.visiblename) new Elem(null, this.userNameLine).text = userData.visiblename
                new Link(`@${userData.username}`, `/profile/${userData.username}`, this.sideBlock.element, true, "user-link")
            }
        }

        const verifiedIcon = new Elem("verified-icon", this.userNameLine)
        for (let i = 0; i < 4; i++) new Elem("ln", verifiedIcon).setStyleProperty("--rotation", `${i * 45}deg`)
        new Elem("check", verifiedIcon).text = "✓"
        verifiedIcon.title = Language.lang.elements.userCard.verified
        verifiedIcon.switchVisible(userData.roles.some(v => v.type === "verifiedUser"))

        const rolesCont = new Elem("role-line", this.sideBlock)
        const rolesLn = new Elem("role-line", rolesCont)

        const updateRoles = () => {
            rolesLn.wipe()
            verifiedIcon.switchVisible(false)
            for (const role of userData.roles) {
                if (role.type === "verifiedUser") {
                    verifiedIcon.switchVisible(true)
                } else {
                    new RoleLabel(role, rolesLn, ["messageHeader"].includes(cardType) || features.shrinkRoles)
                }
            }
            rolesLn.switchVisible(userData.roles.length > 0)
        }

        updateRoles()

        if (User?.data?.permissionsList?.includes("admin:userRoles") && features.roleEdit) {
            const staticRolesPromise = API("get", "/api/data/roles").then(r => r.roles).catch(() => ({}))

            const createRoleBtn = (symbol, actionIsAdd) => {
                const btn = new TextLabel(symbol, rolesCont, "white", true)
                btn.addClass("clickable")
                btn.addEvent("click", async () => {
                    const staticRoles = await staticRolesPromise
                    const ddData = []

                    for (const key in staticRoles) {
                        const roleData = staticRoles[key]
                        const alreadyHas = userData.roles.some(v => v.type === roleData.type)
                        const isSelf = userData.id === User.data.id

                        if (actionIsAdd) {
                            if (!roleData.manuallyAppendable || alreadyHas || (isSelf && !roleData.selfAppendable)) continue
                        } else { 
                            if (!alreadyHas || (isSelf && !roleData.selfAppendable)) continue
                        }

                        const roleName = Language.lang.elements.roleLabel[roleData.type]
                        ddData.push({
                            name: (typeof roleName === "object" ? roleName.lshort : roleName),
                            value: roleData.type,
                            icon: roleData.roleIcon
                        })
                    }

                    if (ddData.length === 0) return

                    const alert = new Alert.Simple(null,
                        actionIsAdd ? Language.lang.elements.userCard.addRole : Language.lang.elements.userCard.rmRole,
                        null, null, actionIsAdd ? "addRole" : "rmrole")

                    const ddlist = new DropdownList(
                        ddData,
                        alert.alertCont,
                        Language.lang.elements.userCard.dd,
                        async (v) => {
                            const resp = await API("put", `/api/profile/${userData.username}/role`, { action: actionIsAdd ? "add" : "remove", role: v })
                            if (resp.HTTPCODE == 200) {
                                userData.roles = resp.roles
                                updateRoles()
                                alert.removeAlert()
                            }
                        },
                        null
                    )

                    ddlist.moveAfter(alert.alertLabel)
                    alert.okButton.text = Language.lang.def.cancel
                })
                return btn
            }

            createRoleBtn("+", true)
            createRoleBtn("-", false)
        }
    }
}
