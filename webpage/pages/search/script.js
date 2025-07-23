import Elem from "../../components/elem/script.js";
import PageNavigator from "../../elements/pagenavigator/script.js";
import PostCard from "../../elements/postCard/script.js";
import SearchField from "../../elements/searchfield/script.js";
import API from "../../scripts/api.js";
import Favourites from "../../scripts/favouriteControl.js";

export const tag = "search";
export const tagLimit = 1;

const itemsPerPage = 10

export async function render(params) {
    const container = new Elem('search-container')

    let currentTags = []

    const posts = new Elem('posts-field', container.element)

    async function renderPosts(tags, page = 0, take = itemsPerPage) {
        posts.wipe()
        const req = []

        if (tags.some(v => v.startsWith('fav:local'))) {
            const localFavIndex = tags.indexOf('fav:local')
            tags.splice(localFavIndex, 1)

            if (Favourites.localFavs)
                tags.push('id:' + Favourites.localFavs.join(','))
        }

        if (tags) req.push(`tags=${tags.join('+')}`)
        if (page) req.push(`p=${page}`)
        if (take) req.push(`t=${take}`)

        const query = req.length > 0 ? `?${req.join('&')}` : ''

        const postsResp = await API('GET', `/api/posts${query}`)

        for (const post of postsResp.posts) {
            new PostCard(post, posts.element)
        }
    }

    async function getPostsCount(tags) {
        const pagesCount = await API('GET', `/api/posts?count=true${tags.length > 0 ? `&tags=${tags.join('+')}` : ''}`)
        return pagesCount.count
    }

    renderPosts(currentTags, 0, itemsPerPage)

    const searchField = new SearchField(container.element, '/api/posts/tags')

    const pagesCount = Math.ceil((await getPostsCount(currentTags)) / itemsPerPage)
    const pageNav = new PageNavigator(pagesCount, 1, container.element)

    posts.moveAfter(searchField.element)
    pageNav.moveAfter(posts.element)

    pageNav.addNavCB((page) => {
        renderPosts(currentTags, page - 1, itemsPerPage)
    })

    searchField.addSearchCB(async (tags) => {
        currentTags = tags
        renderPosts(currentTags, 0, itemsPerPage)
        pageNav.renderButtons(Math.ceil((await getPostsCount(currentTags)) / itemsPerPage), 1)
    })

    return container.element;
}
