import Elem from "../../components/elem/script.js";
import PageNavigator from "../../elements/pagenavigator/script.js";
import PostCard from "../../elements/postCard/script.js";
import SearchField from "../../elements/searchfield/script.js";
import postSearch from "../../scripts/search.js";
import User from "../../scripts/userdata.js";

export const tag = "search";
export const tagLimit = 1;

const itemsPerPage = User.Settings.get("postsPerPage", "p")

export async function render() {
    const container = new Elem("search-container")

    let currentTags = []

    const posts = new Elem("posts-field", container.element)

    async function renderPosts(tags = [], page = 0, take = itemsPerPage) {
        const postsResp = await postSearch(tags, page, take)
        posts.wipe()
        
        for (const post of postsResp.posts) {
            new PostCard(post, posts.element)
        }
    }

    async function getPostsCount(tags) {
        const pagesCount = await postSearch(tags, null, null, true)
        return pagesCount.count
    }

    const searchField = new SearchField(container.element, "/api/posts/tags")

    const URLparams = new URLSearchParams(window.location.search)
    const tagsParams = URLparams.get("tags")
    if (tagsParams) {
        currentTags = tagsParams.split("+").filter(v => v != "")
        searchField.setSearch(currentTags.join(" "))
    }

    const pageParam = URLparams.get("page")

    renderPosts(currentTags, pageParam ? pageParam - 1 : 0, itemsPerPage)

    if (!URLparams.has("tags")) URLparams.set("tags", "")
    if (!URLparams.has("page")) URLparams.set("page", 1)
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
