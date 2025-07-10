import Elem from "../../components/elem/script.js";
import Icon from "../../components/icon/script.js";

export default class SearchField extends Elem {
    constructor(parent, searchCB = true) {
        super('internal-search-field', parent)

        const searchInput = new Elem('search-field', this.element, 'input')
        searchInput.element.type = 'text'
        searchInput.element.placeholder = 'Search...'

        const searchIcon = new Icon('search', this.element, null, "20x20")

        if (searchCB) {
            searchInput.element.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') {
                    searchCB(searchInput.element.value.split(' '))
                } else if (e.key === 'Escape') {
                    searchInput.element.blur()
                }
            })

            searchIcon.element.addEventListener('click', () => {
                searchCB(searchInput.element.value.split(' '))
            })
        }
    }
}
