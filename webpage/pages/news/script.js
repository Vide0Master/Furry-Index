import Elem from "../../components/elem/script.js";
import API from "../../scripts/api.js";
import NewsMessage from "../../elements/newsMessage/script.js";
import PageNavigator from "../../elements/pagenavigator/script.js";

export const tag = "news";
export const tagLimit = 1;
export const titleID = tag

const newsOnPage = 10

export async function render() {
    const container = new Elem("news-page-cont")

    const newsList = new Elem("news-container", container.element)

    async function getNewsCount() {
        const count = await API("GET", `/api/news?count=1`)
        return count.count
    }

    const pageNav = new PageNavigator(Math.ceil((await getNewsCount()) / newsOnPage), 1, container.element, true)

    async function updateNewsList(p) {
        newsList.wipe()
        const messages = await API("GET", `/api/news?p=${p - 1}&t=${newsOnPage}`)

        for (const message of messages.news) {
            new NewsMessage(message, newsList.element)
        }
    }

    updateNewsList(1)

    pageNav.addNavCB(async p => {
        updateNewsList(p)
        pageNav.renderButtons(Math.ceil((await getNewsCount()) / newsOnPage), p)
    })

    return container.element;
}