import Elem from "../../components/elem/script.js";
import Language from "../../scripts/language.js";
import User from "../../scripts/userdata.js";
import API from "../../scripts/api.js";
import Image from "../../components/image/script.js";
import formatDate from "../../scripts/formatDate.js";
import PostCard from "../../elements/postCard/script.js";

export const tag = "profile";
export const tagLimit = 5;

export async function render(params) {
    const container = new Elem('profile-container')

    if (!params.username) {
        new Elem(null, container.element, 'div').text = Language.lang.profile.noUsername
        return container.element
    }

    const profileDataRequest = await API('GET', `/api/profile/${params.username}`)
    if (profileDataRequest.HTTPCODE != 200) {
        new Elem(null, container.element, 'div').text = Language.lang.profile.noProfile
        return container.element
    }

    const Pdata = profileDataRequest.user

    const fdataBlock = new Elem('first-data-block', container.element, 'div')

    if (Pdata?.avatar) {
        const avatarWrapper = new Elem('avatar-wrapper', fdataBlock.element, 'div')
        new Image(`/api/profile/${params.username}/avatar?thumbnail=300`, 'profile-img', avatarWrapper.element)
    }

    const userdatElem = new Elem('user-data', fdataBlock.element, 'div')

    if (Pdata.visiblename) new Elem('visible-name', userdatElem.element, 'div').text = Pdata.username
    new Elem('user-name', userdatElem.element, 'div').text = '@' + Pdata.username
    new Elem('registered-at', userdatElem.element, 'div').text = `${Language.lang.profile.regsitered} ${formatDate(Pdata.createdAt, ['time'])}`

    const latestPostsCont = new Elem('latest-posts-cont', container.element)
    new Elem('latest-posts-title', latestPostsCont.element).text = Language.lang.profile.latestPosts
    const latestPosts = new Elem('latest-posts', latestPostsCont.element)

    async function getUserLatestPosts() {
        const posts = await API('GET', `/api/posts?tags=author:${Pdata.username}&t=5`)
        for (const post of posts.posts) {
            new PostCard(post, latestPosts.element, false)
        }
    }
    getUserLatestPosts()

    // if (User.data.usename == params.username) {

    // } else {
    //     new Elem('profile-username', container.element, 'div')
    // }

    return container.element;
}