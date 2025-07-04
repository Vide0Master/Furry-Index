import Elem from "../../components/elem/script.js";
import PostCard from "../../elements/postCard/script.js";
import API from "../../scripts/api.js";
import Language from "../../scripts/language.js";

export const tag = "main";
export const tagLimit = 1;

export async function render(params) {
    const container = new Elem('main-container')

    const websiteLabel = new Elem('FI-label', container.element)
    new Elem('welcome', websiteLabel.element).text = Language.lang.main.welcome
    const fiCont = new Elem('FI-container', websiteLabel.element).element

    new Elem('FI-text', fiCont).text = 'Furry Index'

    new Elem('bigLabel', container.element).text = 'Featured posts'

    const latestPosts = new Elem('latest-posts', container.element)
    const postsData = await API('GET', '/api/posts?t=10', null, true)
    for (const postData of postsData.posts) {
        new PostCard(postData, latestPosts.element)
    }

    return container.element;
}
