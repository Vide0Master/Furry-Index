import Elem from "../../../components/elem/script.js";
import Icon from "../../../components/icon/script.js";
import Alert from "../../../features/alert/script.js";
import API from "../../../scripts/api.js";
import formatDate from "../../../scripts/formatDate.js";
import Language from "../../../scripts/language.js";
import User from "../../../scripts/userdata.js";
import WSController from "../../../scripts/ws.js";
import UserCard from "../../userCard/script.js";


export default class MessageBlock extends Elem {
    constructor(parent, data, handler) {
        super("message-block-cont", parent)

        new UserCard(this.element, data.user, "messageHeader")

        const textRow = new Elem("text", this.element)
        textRow.text = data.text

        const specialsRow = new Elem("specials-row", this.element)
        specialsRow.switchVisible(false)

        const timeRow = new Elem("time-row", this.element)

        const editedIcon = new Icon("edit", timeRow.element, "edited-icon", "10x10")
        editedIcon.title = `${Language.lang.elements.messages.messageElem.editedAt} ${formatDate(data.editedAt)}`
        editedIcon.switchVisible(data.sentAt != data.editedAt)

        const sent = new Elem("sent-at", timeRow.element)
        sent.text = formatDate(data.sentAt)

        WSController.listen(`messageUpdate-${data.id}`, (data) => {
            switch (data.action) {
            case "edit": {
                textRow.text = data.newText
                editedIcon.switchVisible(true)
            }; break;
            case "delete": this.kill()
            }
        })

        if (User?.data?.username == data.user.username) {
            const controlRow = new Elem("control-row", timeRow.element)

            const editIcon = new Icon("edit", controlRow.element, "edit", "10x10")
            editIcon.addEvent("click", () => {
                new Alert.Input(null, Language.lang.elements.messages.messageElem.editMessage, async (v) => {
                    await API("PUT", handler, {
                        msgID: data.id,
                        newText: v
                    })
                }, null, "bigField", textRow.text, null, `${data.id}-EDIT`)
            })
            editIcon.title = Language.lang.elements.messages.messageElem.editMessage

            const rmIcon = new Icon("cross", controlRow.element, "rm", "10x10")
            rmIcon.addEvent("click", () => {
                new Alert.Confirm(`"${textRow.text}"`, Language.lang.elements.messages.messageElem.removeMessage, async () => {
                    await API("DELETE", handler, {
                        msgID: data.id
                    })
                }, null, null, `${data.id}-DELETE`)
            })
            rmIcon.title = Language.lang.elements.messages.messageElem.removeMessage
        }
    }
}
