import BigTextField from "../../components/bigtextfield/script.js";
import Elem from "../../components/elem/script.js";
import TextInputLine from "../../components/textinputline/script.js";
import DropdownList from "../../components/dropdownList/script.js";
import Language from "../../scripts/language.js";
import Button from "../../components/button/script.js";
import API from "../../scripts/api.js";
import NewsMessage from "../../elements/newsMessage/script.js";

export const tag = "adminnews";
export const tagLimit = 1;

export async function render() {
    const container = new Elem("admin-news-manager")

    const newsList = new Elem("news-container", container.element)

    async function updateNewsList(p) {
        newsList.wipe()
        const messages = await API("GET", `/api/news?p=${p}`)

        for (const message of messages.news) {
            new NewsMessage(message, newsList.element)
        }
    }

    updateNewsList(0)

    const newsEditor = new Elem("news-editor-container", container.element)

    const newsData = {
        title: {},
        description: {},
        tags: []
    }

    let letterLabel, letterDesc

    const langSelect = new DropdownList(
        Language.availableLanguages.map((k) => ({
            name: Language.lang.settings.webpage.language[k],
            value: k,
            selected: false
        })),
        newsEditor.element, Language.lang.settings.webpage.language.label, (v) => {
            letterLabel.value = newsData.title[v] ? newsData.title[v] : ""
            letterDesc.input = newsData.description[v] ? newsData.description[v] : ""
        }, Language.lang.settings.webpage.language.label + ": ")

    letterLabel = new TextInputLine("Label", newsEditor.element, null, null, (v) => {
        newsData.title[langSelect.value] = v
        console.log(newsData)
    })

    letterDesc = new BigTextField("description", newsEditor.element, 10000, (v) => {
        newsData.description[langSelect.value] = v
        console.log(newsData)
    })

    const tagsField = new BigTextField(Language.lang.elements.postMaker.tags, newsEditor.element, "custom", (val) => {
        tagsField.input = tagsField.input.toLowerCase()
        const tags = val.split(" ").filter(tag => tag != "" && !tag.startsWith("#"))
        tagsField.setLimit(tags.length)
        newsData.tags = tags
        console.log(newsData)
    })

    const submitButton = new Button("submit", newsEditor.element, null, async () => {
        const result = await API("POST", "/api/news", newsData)
        console.log(result)
    })

    return container.element;
}
