import Elem from "../../components/elem/script.js";
import PostCard from "../../elements/postCard/script.js";
import API from "../../scripts/api.js";

export const tag = "main";
export const tagLimit = 1;

export async function render(params) {
    const container = new Elem('main-container')

    const latestPosts = new Elem('latest-posts', container.element)
    const postsData = await API('GET', '/api/posts?t=10', null, true)
    for (const postData of postsData.posts) {
        new PostCard(postData, latestPosts.element)
    }

    return container.element;
}
