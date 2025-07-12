import Elem from "../../components/elem/script.js";
import Image from "../../components/image/script.js";
import FileCard from "../../elements/fileCard/script.js";
import PageNavigator from "../../elements/pagenavigator/script.js";
import SearchField from "../../elements/searchfield/script.js";
import API from "../../scripts/api.js";
import Language from "../../scripts/language.js";

export const tag = "file-manager";
export const tagLimit = 1;

const itemsPerPage = 10

export async function render(params) {
    const container = new Elem('file-manager-container')

    let currentTags = []

    const searchBar = new Elem('search-bar', container.element)

    const fileField = new Elem('files-container', container.element)

    async function renderFiles(tags, page = 0, take = itemsPerPage) {
        fileField.wipe()
        const req = []

        if (tags) req.push(`tags=${tags.join('+')}`)
        if (page) req.push(`p=${page}`)
        if (take) req.push(`t=${take}`)

        const query = req.length > 0 ? `?${req.join('&')}` : ''

        const filesResp = await API('GET', `/api/files${query}`)
        for (const file of filesResp.files) {
            new FileCard(file, false, fileField.element)
        }
    }

    async function getFilesCount(tags) {
        const pagesCount = await API('GET', `/api/files?count=true${tags.length > 0 ? `&tags=${tags.join('+')}` : ''}`)
        return pagesCount.count
    }

    renderFiles(currentTags, 0, itemsPerPage)

    const searchField = new SearchField(searchBar.element)

    const pagesCount = Math.ceil((await getFilesCount(currentTags)) / itemsPerPage)
    const pageNav = new PageNavigator(pagesCount, 1, container.element)

    pageNav.addNavCB((page) => {
        renderFiles(currentTags, page - 1, itemsPerPage)
    })

    searchField.addSearchCB(async (tags) => {
        currentTags = tags
        renderFiles(currentTags, 0, itemsPerPage)
        pageNav.renderButtons(Math.ceil((await getPostsCount(currentTags)) / itemsPerPage), 1)
    })

    return container.element;
}
