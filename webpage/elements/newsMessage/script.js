import Button from "../../components/button/script.js";
import Elem from "../../components/elem/script.js";
import API from "../../scripts/api.js";
import formatDate from "../../scripts/formatDate.js";
import Language from "../../scripts/language.js";
import TextLabel from "../textLabel/script.js";
import UserCard from "../userCard/script.js";
import Alert from "../../features/alert/script.js";

export default class NewsMessage extends Elem {
    constructor(newsMessageData, parent, editcb, rmcb) {
        super("news-message-container", parent)

        console.log(newsMessageData)

        const msgHeader = new Elem("msg-header", this.element)

        new UserCard(msgHeader.element, newsMessageData.author)

        const headerSideBlock = new Elem("header-side-block", msgHeader.element)

        const label = new Elem("label", headerSideBlock.element)
        label.text = newsMessageData.title[Language.currentLang] ? newsMessageData.title[Language.currentLang] : newsMessageData.title["ENG"]

        const tagsRow = new Elem("tags-row", headerSideBlock.element)

        for (const tag of newsMessageData.tags) {
            const labelData = { text: tag, color: "#ffffff" }
            switch (true) {
                case tag.startsWith("v"): {
                    labelData.color = "#1ce4c9"
                }; break;
                default: break;
            }
            new TextLabel(labelData.text, tagsRow.element, labelData.color)
        }

        new TextLabel(formatDate(newsMessageData.postedAt), tagsRow.element)

        const msgContent = new Elem("msg-content", this.element)
        msgContent.text = newsMessageData.description[Language.currentLang] ? newsMessageData.description[Language.currentLang] : newsMessageData.description["ENG"]

        if (editcb) new Button(Language.lang.elements.newsMessage.buttons.edit, msgHeader.element, null, () => {
            editcb(newsMessageData)
        })

        if (rmcb) new Button(Language.lang.elements.newsMessage.rmConf.label, msgHeader.element, null, async () => {
            new Alert.Confirm(`${Language.lang.elements.newsMessage.rmConf.conf} "${newsMessageData.title[Language.currentLang]}"`, Language.lang.elements.newsMessage.rmConf.label, async () => {
                const result = await API("DELETE", "/api/news?id=" + newsMessageData.id)
                rmcb(result.HTTPCODE == 200)
            })
        })
    }
}
