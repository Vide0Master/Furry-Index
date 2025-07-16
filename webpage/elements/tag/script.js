import Elem from "../../components/elem/script.js";
import Icon from "../../components/icon/script.js";
import Language from "../../scripts/language.js";

function capitalizeFirst(str) {
    if (!str) return '';
    return str[0].toUpperCase() + str.slice(1);
}


export default class Tag extends Elem {
    constructor(tagData, parent) {
        super('tag-element', parent)

        if (tagData.icon) new Icon(tagData.icon, this.element, null, '14x14')
        const text = new Elem('tag-name', this.element)

        text.text = tagData.name

        if (tagData.count) new Elem('count', this.element).text = tagData.count

        if (tagData.group) {
            this.element.title = tagData?.group.name[Language.currentLang] ? tagData.group.name[Language.currentLang] : capitalizeFirst(tagData.group.basename)
        }
        if (tagData.group) {
            this.element.style = `--tag-color: ${tagData.group.color};`
        } else {
            this.element.style = `--tag-color: #5b34eb;`
        }
    }
}