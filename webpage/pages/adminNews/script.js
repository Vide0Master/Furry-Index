import BigTextField from "../../components/bigtextfield/script.js";
import Elem from "../../components/elem/script.js";
import TextInputLine from "../../components/textinputline/script.js";
import DropdownList from "../../components/dropdownList/script.js";
import Language from "../../scripts/language.js";
import Button from "../../components/button/script.js";
import API from "../../scripts/api.js";
import NewsMessage from "../../elements/newsMessage/script.js";
import PageNavigator from "../../elements/pagenavigator/script.js";
import User from "../../scripts/userdata.js";

export const tag = "adminnews";
export const tagLimit = 1;
export const titleID = "news"

const newsOnPage = 10

export async function render() {
    const container = new Elem("admin-news-manager")

    if (!User.testUserPermission("admin:news")) {
        container.text = Language.lang.SYSTEM.navigation.noAccess
        return container.element
    }

    const leftCont = new Elem("news-navigator-cont", container.element)

    const newsList = new Elem("news-container", leftCont.element)

    const newsEditor = new Elem("news-editor-container", container.element)

    const newsData = {
        title: {},
        description: {},
        tags: []
    }

    let editing = ""

    const langSelect = new DropdownList(
        Language.availableLanguages.map((k) => ({
            name: Language.lang.settings.webpage.language[k],
            value: k,
            selected: false
        })),
        newsEditor.element, Language.lang.settings.webpage.language.label, (v) => {
            letterLabel.enabled = true
            letterDesc.enabled = true
            tagsField.enabled = true
            letterLabel.value = newsData.title[v] ? newsData.title[v] : ""
            letterDesc.value = newsData.description[v] ? newsData.description[v] : ""
        }, Language.lang.settings.webpage.language.label + ": ")

    const letterLabel = new TextInputLine(Language.lang.adminNews.editor.label, newsEditor.element, null, null, (v) => {
        newsData.title[langSelect.value] = v
        testResultsForButton()
    })
    letterLabel.enabled = false

    const letterDesc = new BigTextField(Language.lang.adminNews.editor.description, newsEditor.element, 10000, (v) => {
        newsData.description[langSelect.value] = v
        testResultsForButton()
    })
    letterDesc.enabled = false

    for (const lang of Language.availableLanguages) {
        letterLabel.addCheck(Language.lang.settings.webpage.language[lang], () => { return !!newsData.title[lang] })
        letterDesc.addCheck(Language.lang.settings.webpage.language[lang], () => { return !!newsData.description[lang] })
    }

    letterLabel.checkBlock.element.style.flexDirection = "row"
    letterDesc.checkBlock.element.style.flexDirection = "row"

    const tagsField = new BigTextField(Language.lang.adminNews.editor.tags, newsEditor.element, "custom", (val) => {
        tagsField.value = tagsField.value.toLowerCase()
        const tags = val.split(" ").filter(tag => tag != "" && !tag.startsWith("#"))
        tagsField.setLimit(tags.length)
        newsData.tags = tags
        testResultsForButton()
    })
    tagsField.addCheck(`${Language.lang.adminNews.editor.tagsCheck.min} 2 ${Language.lang.adminNews.editor.tagsCheck.tags}`, (val) => {
        const tags = val.split(" ").filter(tag => tag != "" && !tag.startsWith("#"))
        return tags.length > 1
    })
    tagsField.setLimit(0)
    tagsField.enabled = false

    function testResultsForButton() {
        submitButton.enabled = letterDesc.checksInf.okAll && letterLabel.checksInf.okAll && tagsField.checksInf.okAll
    }

    const submitButton = new Button(Language.lang.adminNews.editor.button.post, newsEditor.element, null, async () => {
        let resp
        if (editing != "") {
            resp = await API("PUT", "/api/news?id=" + editing, newsData)
            editing = ""
        } else {
            resp = await API("POST", "/api/news", newsData)
        }

        console.log(resp)

        resetFields()

        updateNewsList(1)
    })
    submitButton.enabled = false

    function resetFields() {
        langSelect.selectOption("placeholder")

        newsData.title = {}
        newsData.description = {}
        newsData.tags = []

        letterLabel.enabled = false
        letterDesc.enabled = false
        tagsField.enabled = false
        submitButton.enabled = false

        letterLabel.value = ""
        letterDesc.value = ""
        tagsField.value = ""

        letterLabel.testChecksWithCB(true)
        letterDesc.testChecksWithCB(true)
        tagsField.testChecksWithCB(true)

        submitButton.text = Language.lang.adminNews.editor.button.post
    }

    async function getNewsCount() {
        const count = await API("GET", `/api/news?count=1`)
        return count.count
    }

    const pageNav = new PageNavigator(Math.ceil((await getNewsCount()) / newsOnPage), 1, leftCont.element, true)

    async function updateNewsList(p) {
        newsList.wipe()
        const messages = await API("GET", `/api/news?p=${p - 1}`)

        for (const message of messages.news) {
            new NewsMessage(message, newsList.element, v => {
                const dataKeys = ["title", "description", "tags"]

                for (const key of dataKeys) {
                    newsData[key] = v[key]
                }

                langSelect.selectOption("ENG")

                tagsField.value = newsData.tags.join(" ")

                letterLabel.enabled = true
                letterDesc.enabled = true
                tagsField.enabled = true

                letterLabel.testChecksWithCB(true)
                letterDesc.testChecksWithCB(true)
                tagsField.testChecksWithCB(true)

                editing = message.id

                submitButton.text = `${Language.lang.adminNews.editor.button.edit} "${message.title[Language.currentLang]}"`
            }, () => {
                updateNewsList(1)
            })
        }
    }

    updateNewsList(1)

    pageNav.addNavCB(async p => {
        updateNewsList(p)
        pageNav.renderButtons(Math.ceil((await getNewsCount()) / newsOnPage), p)
    })

    return container.element;
}
