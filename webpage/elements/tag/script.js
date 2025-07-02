import Elem from "../../components/elem/script.js";
import Icon from "../../components/icon/script.js";
import Language from "../../scripts/language.js";

export default class Tag {
    constructor(tagData, parent) {
        this.element = new Elem('tag-element', parent)
        if (tagData.icon) new Icon(tagData.icon, this.element.element,null,'14x14')
        const text = new Elem('tag-name', this.element.element)

        text.text = tagData.name

        this.element.element.title = tagData?.group.name[Language.currentLang] ? tagData.group.name[Language.currentLang] : tagData.group.basename
        if (tagData.group) this.element.element.style = `--tag-color: ${tagData.group.color};`
    }
}