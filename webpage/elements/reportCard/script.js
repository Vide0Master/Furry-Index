import Elem from "../../components/elem/script.js";
import formatDate from "../../scripts/formatDate.js";
import Language from "../../scripts/language.js";
import PostCard from "../postCard/script.js";
import TextLabel from "../textLabel/script.js";
import UserCard from "../userCard/script.js";

export default class ReportCard extends Elem {
    constructor(parent, data) {
        super("internal-report-card", parent)

        const topLine = new Elem("top-line", this)

        if (data.author === "anon") {
            new Elem("reporter-anon", topLine).text = Language.lang.elements.reportCard.anon
        } else if (typeof data.author === "object") {
            new UserCard(topLine, data.author, undefined, { shrinkName: true })
        }

        const topLnSideBlock = new Elem("side-block", topLine)
        new Elem("subject", topLnSideBlock).text = `${Language.lang.elements.reportCard.subject.label}: ${Language.lang.elements.reportCard.subject[data.type]}`

        const infoLine = new Elem("info-line", topLnSideBlock)
        new TextLabel(`${Language.lang.elements.reportCard.reported}: ${formatDate(data.createdAt)}`, infoLine, "var(--ok-color)")
        new TextLabel(`${Language.lang.elements.reportCard.status.label}: ${Language.lang.elements.reportCard.status[data.state]}`, infoLine)

        const bottomLine = new Elem("bottom-line", this)

        new Elem("description", bottomLine).text = data.description ? `${Language.lang.elements.reportCard.description.label}: ${data.description}` : Language.lang.elements.reportCard.description.no

        for (const key in data.data) {
            switch (key) {
                case "post": {
                    new PostCard(data.data[key], bottomLine, false)
                }; break;
            }
        }
    }
}