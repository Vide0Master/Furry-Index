import Elem from "../../components/elem/script.js";
import PageNavigator from "../../elements/pagenavigator/script.js";
import PostCard from "../../elements/postCard/script.js";
import SearchField from "../../elements/searchfield/script.js";
import API from "../../scripts/api.js";
import Favourites from "../../scripts/favouriteControl.js";
import User from "../../scripts/userdata.js";

export const tag = "search";
export const tagLimit = 1;

const itemsPerPage = User.Settings.get('postsPerPage')

export async function render() {
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

    const searchField = new SearchField(container.element, '/api/posts/tags')

    const URLparams = new URLSearchParams(window.location.search)
    const tagsParams = URLparams.get('tags')
    if (tagsParams) {
        currentTags = tagsParams.split('+').filter(v => v != '')
        searchField.setSearch(currentTags.join(' '))
    }

    const pageParam = URLparams.get('page')

    renderPosts(currentTags, pageParam ? pageParam - 1 : 0, itemsPerPage)

    if (!URLparams.has('tags')) URLparams.set('tags', '')
    if (!URLparams.has('page')) URLparams.set('page', 1)
    history.replaceState({}, "", `${window.location.pathname}?${URLparams}`)

    const pagesCount = Math.ceil((await getPostsCount(currentTags)) / itemsPerPage)
    const pageNav = new PageNavigator(pagesCount, 1, container.element)

    posts.moveAfter(searchField.element)
    pageNav.moveAfter(posts.element)

    pageNav.addNavCB(async (page) => {
        renderPosts(currentTags, page - 1, itemsPerPage)
        pageNav.renderButtons(Math.ceil((await getPostsCount(currentTags)) / itemsPerPage), page)
    })

    searchField.addSearchCB(async (tags) => {
        currentTags = tags
        renderPosts(currentTags, 0, itemsPerPage)
        pageNav.renderButtons(Math.ceil((await getPostsCount(currentTags)) / itemsPerPage), 1)
    })

    return container.element;
}
