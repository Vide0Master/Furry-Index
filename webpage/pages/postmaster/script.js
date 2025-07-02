import Button from "../../components/button/script.js";
import Elem from "../../components/elem/script.js";
import PostCard from "../../elements/postCard/script.js";
import makePostMaker from "../../elements/postMaker/script.js";
import API from "../../scripts/api.js";

export async function render(params) {
    const container = new Elem('postmaster-container')

    const headBar = new Elem('head-bar', container.element)

    const newPostButton = new Button('Create post', headBar.element, null, async () => {
        makePostMaker(null,loadPosts)
    })

    const postsField = new Elem('posts-field', container.element)

    async function loadPosts() {
        postsField.element.innerHTML = ''

        const posts = await API('GET', '/api/myposts', null, true)

        for (const post of posts.posts) {
            new PostCard(post, postsField.element, true)
        }
    }

    loadPosts()

    return container.element;
}