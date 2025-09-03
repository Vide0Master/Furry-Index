import Elem from "../../components/elem/script.js";
import Icon from "../../components/icon/script.js";
import Link from "../../components/link/script.js";
import Language from "../../scripts/language.js";

function capitalizeFirst(str) {
    if (!str) return '';
    return str[0].toUpperCase() + str.slice(1);
}

// so i made this tag rework
// i thought that i will make it work as link, but remembered that in Pi-Archive i used something... special
// plus and minus for searching
// remembering this... i reverted to elem as base for tag element
// remade some parts of code that was intented for display, now for use as links

// tested rn, tags work as links, so the will correctly redirect to search page

// good luck understanding this :D
export default class Tag extends Elem {
    constructor(tagData, parent, interactable = false, searchLink) {
        super('tag-element', parent)

        if (tagData.icon) new Icon(tagData.icon, this.element, null, '14x14')

        if (searchLink) {
            const params = new URLSearchParams(window.location.search)

            const tags = (params.get('tags') || '').split(' ').filter(v => v != '').map(v => v.trim())

            const includedInSearch = tags.includes(tagData.name)

            if (!includedInSearch && tags.length > 0) {
                new Link('+', `${searchLink}?tags=${tags.concat([tagData.name]).join('+')}`, this.element, true, ['tag-name', 'p-m'])
                new Link('-', `${searchLink}?tags=${tags.concat(['-' + tagData.name]).join('+')}`, this.element, true, ['tag-name', 'p-m'])
            }

            const lnkRslt = new Link(tagData.name, `${searchLink}?tags=${tagData.name}`, this.element, true, 'tag-name')
            if (includedInSearch) {
                lnkRslt.element.classList.add('underlined')
            }
        } else {
            const text = new Elem('tag-name', this.element)
            text.text = tagData.name
        }

        if (tagData.count) new Elem('count', this.element).text = tagData.count

        if (tagData.group) {
            this.element.title = tagData?.group.name[Language.currentLang] ? tagData.group.name[Language.currentLang] : capitalizeFirst(tagData.group.basename)
        }
        if (tagData.group) {
            this.element.style = `--tag-color: ${tagData.group.color};`
        } else {
            this.element.style = `--tag-color: #5b34eb;`
        }

        if (interactable) this.element.classList.add('interactible')
    }
}
