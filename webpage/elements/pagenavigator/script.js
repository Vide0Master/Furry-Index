import Elem from "../../components/elem/script.js";

export default class PageNavigator extends Elem {
    constructor(itemsPerPage, totalItems, parent, chcb, hvcb, currentPage) {
        super('internal-page-navigator', parent);
        const pageCount = Math.ceil(totalItems / itemsPerPage);

        this.currentPage = currentPage || 1;

        for (let i = 0; i < pageCount; i++) {
            const pageButton = new Elem('page-button', this.element);
            pageButton.text = i + 1
        }
    }
}