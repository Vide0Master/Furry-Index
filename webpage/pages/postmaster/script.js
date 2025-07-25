import Button from "../../components/button/script.js";
import Elem from "../../components/elem/script.js";
import PostCard from "../../elements/postCard/script.js";
import makePostMaker from "../../elements/postMaker/script.js";
import SearchField from "../../elements/searchfield/script.js";
import API from "../../scripts/api.js";
import Language from "../../scripts/language.js";
import User from "../../scripts/userdata.js";
import PageNavigator from "../../elements/pagenavigator/script.js";

export const tag = "postmaster";
export const tagLimit = 1;

const itemsPerPage = 10

export async function render(params) {
    const container = new Elem('postmaster-container')

    let currentTags = []

    const headBar = new Elem('head-bar', container.element)

    const postsField = new Elem('posts-field', container.element)

    async function renderPosts(tags = [], page = 0, take = itemsPerPage) {
        postsField.wipe()
        const req = []

        tags.push(`author:${User.data.username}`)

        if (tags) req.push(`tags=${tags.join('+')}`)
        if (page) req.push(`p=${page}`)
        if (take) req.push(`t=${take}`)

        const query = req.length > 0 ? `?${req.join('&')}` : ''

        const postsResp = await API('GET', `/api/posts${query}`)

        for (const post of postsResp.posts) {
            new PostCard(post, postsField.element, true, () => { renderPosts(currentTags, 0, itemsPerPage) })
        }
    }

    async function getPostsCount(tags = []) {
        tags.push(`author:${User.data.username}`)
        const pagesCount = await API('GET', `/api/posts?count=true${tags.length > 0 ? `&tags=${tags.join('+')}` : ''}`)
        return pagesCount.count
    }

    renderPosts(currentTags, 0, itemsPerPage)

    const searchField = new SearchField(headBar.element, '/api/posts/tags')

    const newPostButton = new Button(Language.lang.postMaster.newPost, headBar.element, null, async () => {
        makePostMaker(null, () => { renderPosts(currentTags, 1, itemsPerPage) })
    })

    const pagesCount = Math.ceil((await getPostsCount(currentTags)) / itemsPerPage)
    const pageNav = new PageNavigator(pagesCount, 1, container.element)

    async function loadPost(postid) {
        const postdata = await API('GET', `/api/posts/${postid}`)
        makePostMaker(postdata.post, () => { renderPosts(currentTags, 1, itemsPerPage) })
    }

    pageNav.addNavCB((page) => {
        renderPosts(currentTags, page - 1, itemsPerPage)
    })

    searchField.addSearchCB(async (tags) => {
        currentTags = tags
        renderPosts(currentTags, 0, itemsPerPage)
        pageNav.renderButtons(Math.ceil((await getPostsCount(currentTags)) / itemsPerPage), 1)
    })

    if (params.postID) loadPost(params.postID)

    return container.element;
}