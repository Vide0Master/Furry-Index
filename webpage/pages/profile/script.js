import Elem from "../../components/elem/script.js";
import Language from "../../scripts/language.js";
import User from "../../scripts/userdata.js";
import API from "../../scripts/api.js";
import PostCard from "../../elements/postCard/script.js";
import Link from "../../components/link/script.js";
import UserCard from "../../elements/userCard/script.js";
import postSearch from "../../scripts/search.js";
import Router from "../../scripts/router.js";

export const tag = "profile";
export const tagLimit = 5;

export async function render(params) {
    const container = new Elem("profile-container")

    if (!params.username) {
        new Elem(null, container.element, "div").text = Language.lang.profile.noUsername
        return container.element
    }

    const profileDataRequest = await API("GET", `/api/profile/${params.username}`)
    if (profileDataRequest.HTTPCODE != 200) {
        new Elem(null, container.element, "div").text = Language.lang.profile.noProfile
        return container.element
    }

    const Pdata = profileDataRequest.user

    Router.setTitle(Pdata.visiblename ? Pdata.visiblename : `@${Pdata.username}`)

    const userCard = new UserCard(container.element, Pdata, "default", [])

    if (User.data.username == Pdata.username) {
        const editprofile = new Link("", `/settings?t=user`, userCard.element, true, "edit-profile", "edit")
        editprofile.textElem.kill()
    }

    const posts = await postSearch([`author:${Pdata.username}`], 0, 10, false, User.data.username == Pdata.username)

    if (posts.posts?.length > 0) {
        const latestPostsCont = new Elem("latest-posts-cont", container.element)
        new Elem("latest-posts-title", latestPostsCont.element).text = Language.lang.profile.latestPosts
        const latestPosts = new Elem("latest-posts", latestPostsCont.element)
        for (const post of posts.posts) {
            new PostCard(post, latestPosts.element, false)
        }
    }

    return container.element;
}