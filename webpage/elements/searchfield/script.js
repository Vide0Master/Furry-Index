import Elem from "../../components/elem/script.js";
import Icon from "../../components/icon/script.js";

export default class SearchField extends Elem {
    constructor(parent) {
        super('internal-search-field', parent)

        const searchInput = new Elem('search-field', this.element, 'input')
        searchInput.element.type = 'text'
        searchInput.element.placeholder = 'Search...'

        const searchIcon = new Icon('search', this.element, null, "20x20")

        this.getTags = () => {
            return searchInput.element.value.split(' ')
        }

        this.callbacks = []

        this.addSearchCB = (func) => {
            this.callbacks.push(func)
        }

        searchInput.element.addEventListener('keyup', (e) => {
            switch (e.key) {
                case 'Enter': this.startCallbacks(); break
                case 'Escape': searchInput.element.blur(); break;
            }
        })

        searchIcon.element.addEventListener('click', this.startCallbacks)
    }

    startCallbacks() {
        this.callbacks.forEach((cb) => cb(this.getTags()))
    }
}
