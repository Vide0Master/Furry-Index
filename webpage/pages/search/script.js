import Elem from "../../components/elem/script.js";
import PageNavigator from "../../elements/pagenavigator/script.js";
import PostCard from "../../elements/postCard/script.js";
import SearchField from "../../elements/searchfield/script.js";
import API from "../../scripts/api.js";
import Language from "../../scripts/language.js";

export const tag = "search";
export const tagLimit = 1;

const itemsPerPage = 10

export async function render(params) {
    const container = new Elem('search-container')

    const posts = new Elem('posts-field', container.element)

    async function renderPosts(tags, page, take) {
        posts.wipe()
        const req = []

        if (tags) req.push(`tags=${tags.join('+')}`)
        if (page) req.push(`p=${page}`)
        if (take) req.push(`t=${take}`)

        const postsResp = await API('GET', `/api/posts${req.length > 0 ? `?${req.join('&')}` : ''}`)

        for (const post of postsResp.posts) {
            new PostCard(post, posts.element)
        }
    }

    renderPosts([], 0, itemsPerPage)

    const searchField = new SearchField(container.element, renderPosts)

    posts.moveAfter(searchField.element)

    const pageNav = new PageNavigator(itemsPerPage, 30, container.element)

    return container.element;
}
