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
    constructor(parent, userData, cardType = "default", features = []) {
        super("internal-user-card", parent)

        if (!["default", "messageHeader"].includes(cardType)) return

        if (userData?.globalprofileparams?.avatarShape) {
            this.addClass(`shape-${userData?.globalprofileparams?.avatarShape}`)
        }

        if (userData.avatarID) {
            const avatarCont = new Elem("avatar-cont", this.element)
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

        const rolesCont = new Elem("role-line", sideBlock)
        const rolesLn = new Elem("role-line", rolesCont)

        const updateRoles = () => {
            rolesLn.wipe()
            for (const role of userData.roles) {
                new RoleLabel(role, rolesLn, ["messageHeader"].includes(cardType))
            }
            rolesLn.switchVisible(userData.roles.length > 0)
        }

        updateRoles()

        if (User?.data?.permissionsList?.includes("admin:userRoles") && features.includes("roleEdit")) {
            async function makeRoleEditBtns() {
                const staticRoles = (await API("get", "/api/data/roles")).roles

                const addRoleBtn = new TextLabel("+", rolesCont, "white", true)
                addRoleBtn.addClass("clickable")
                addRoleBtn.addEvent("click", async () => {

                    const ddData = []

                    for (const role in staticRoles) {
                        const roleData = staticRoles[role]

                        if (!roleData.manuallyAppendable || userData.roles.some(v => v.type == roleData.type)) continue

                        const roleName = Language.lang.elements.roleLabel[roleData.type]

                        ddData.push({
                            name: typeof roleName === "object" ? roleName.lshort : roleName,
                            value: roleData.type,
                            icon: roleData.roleIcon
                        })
                    }

                    if (ddData.length == 0) return
                    const alert = new Alert.Simple(null, "Add role", null, null, "addRole")
                    
                    const ddlist = new DropdownList(
                        ddData,
                        alert.alertCont,
                        "Add role",
                        async (v) => {
                            console.log(v)
                            const resp = await API("put", `/api/profile/${userData.username}/role`, { action: "add", role: v })
                            if (resp.HTTPCODE == 200) {
                                userData.roles = resp.roles
                                updateRoles()
                                alert.removeAlert()
                            }
                        },
                        null)

                    ddlist.moveAfter(alert.alertLabel)
                    alert.okButton.text = Language.lang.def.cancel
                })

                const rmRoleBtn = new TextLabel("-", rolesCont, "white", true)
                rmRoleBtn.addClass("clickable")
                rmRoleBtn.addEvent("click", async () => {
                    const ddData = []

                    for (const role in staticRoles) {
                        const roleData = staticRoles[role]

                        if (!userData.roles.some(v => v.type == roleData.type) || userData.roles[0].type == roleData.type) continue

                        const roleName = Language.lang.elements.roleLabel[roleData.type]

                        ddData.push({
                            name: typeof roleName === "object" ? roleName.lshort : roleName,
                            value: roleData.type,
                            icon: roleData.roleIcon
                        })
                    }

                    if (ddData.length == 0) return

                    const alert = new Alert.Simple(null, "Add role", null, null, "addRole")

                    const ddlist = new DropdownList(
                        ddData,
                        alert.alertCont,
                        "Remove role",
                        async (v) => {
                            console.log(v)
                            const resp = await API("put", `/api/profile/${userData.username}/role`, { action: "remove", role: v })
                            if (resp.HTTPCODE == 200) {
                                userData.roles = resp.roles
                                updateRoles()
                                alert.removeAlert()
                            }
                        },
                        null)

                    ddlist.moveAfter(alert.alertLabel)
                    alert.okButton.text = Language.lang.def.cancel
                })
            }

            makeRoleEditBtns()
        }
    }
}