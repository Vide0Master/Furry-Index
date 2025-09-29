import Elem from "../../components/elem/script.js";
import Language from "../../scripts/language.js";
import TextLabel from "../textLabel/script.js";
import UserCard from "../userCard/script.js";

export default class NewsMessage extends Elem {
    constructor(newsMessageData, parent) {
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
                case tag.startsWith("v"):{
                    labelData.color="#1ce4c9"
                };break;
                default: break;
            }
            new TextLabel(labelData.text, tagsRow.element, labelData.color)
        }

        const msgContent = new Elem("msg-content", this.element)
        msgContent.text = newsMessageData.description[Language.currentLang] ? newsMessageData.description[Language.currentLang] : newsMessageData.description["ENG"]
    }
}