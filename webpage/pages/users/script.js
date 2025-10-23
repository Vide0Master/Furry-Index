import Elem from "../../components/elem/script.js";
import SearchField from "../../elements/searchfield/script.js";
import PageNavigator from "../../elements/pagenavigator/script.js";
import UserCard from "../../elements/userCard/script.js";
import API from "../../scripts/api.js";

export const tag = "users";
export const tagLimit = 1;
export const titleID = tag

const itemsPerPage = 50

async function userSearch(tags = [], page = 0, take = 10, count = false) {
    const params = new URLSearchParams();

    if (tags.length > 0) {
        params.set("tags", tags.join("+"));
    }

    if (count) {
        params.set("count", "true");
    } else {
        if (page) params.set("p", page);
        if (take) params.set("t", take);
    }

    const query = params.toString() ? `?${params.toString()}` : "";
    const postsResp = await API("GET", `/api/users${query}`);
    return postsResp;
}

export async function render() {
    const container = new Elem("users-search-cont")

    let currentTags = []

    const usersCont = new Elem("users-field", container.element)

    async function renderPosts(tags = [], page = 0, take = itemsPerPage) {
        const usersResp = await userSearch(tags, page, take)
        usersCont.wipe()

        for (const user of usersResp.users) {
            new UserCard(usersCont.element, user)
        }
    }

    async function getUsersCount(tags) {
        const pagesCount = await userSearch(tags, null, null, true)
        return pagesCount.count
    }

    const searchField = new SearchField(container.element)

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

    const pagesCount = Math.ceil((await getUsersCount(currentTags)) / itemsPerPage)
    const pageNav = new PageNavigator(pagesCount, 1, container.element)

    usersCont.moveAfter(searchField.element)
    pageNav.moveAfter(usersCont.element)

    pageNav.addNavCB(async (page) => {
        renderPosts(currentTags, page - 1, itemsPerPage)
        pageNav.renderButtons(Math.ceil((await getUsersCount(currentTags)) / itemsPerPage), page)
    })

    searchField.addSearchCB(async (tags) => {
        currentTags = tags
        renderPosts(currentTags, 0, itemsPerPage)
        pageNav.renderButtons(Math.ceil((await getUsersCount(currentTags)) / itemsPerPage), 1)
    })

    return container.element;
}