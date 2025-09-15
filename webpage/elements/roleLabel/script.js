import Elem from "../../components/elem/script.js";
import Icon from "../../components/icon/script.js";
import Language from "../../scripts/language.js";

export default class RoleLabel extends Elem {
    constructor(roleData, parent, short = false) {
        super('role-label', parent)
        if (roleData.roleIcon) new Icon(roleData.roleIcon, this.element, null, '15x15')

        const visibleRoleName = Language.lang.elements.roleLabel[roleData.type]
        const isNameObj = typeof visibleRoleName == 'object'

        if (!short) {
            new Elem('role-label-text', this.element).text = isNameObj ? visibleRoleName.lshort : visibleRoleName
            if (isNameObj) this.title = visibleRoleName.long
        } else {
            this.title = isNameObj ? visibleRoleName.long : visibleRoleName
            this.addClass('short')
        }

        if (roleData.roleColor) {
            this.setStyleProperty('--role-color', roleData.roleColor)
            this.setStyleProperty('--icon-color', roleData.roleColor)
        }
    }
}