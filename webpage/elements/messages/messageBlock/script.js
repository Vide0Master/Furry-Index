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

        const hasAvatar = data.user.avatarID

        if (hasAvatar)
            new UserCard(this.element, data.user, "avatarOnly", { messageHeader: true })

        const msgBlock = new Elem("msg-block", this)

        new UserCard(msgBlock, data.user, "usernameOnly", { shrinkRoles: true })

        const textRow = new Elem("text", msgBlock)
        if (data.deleted) {
            textRow.text = `${Language.lang.elements.messages.messageElem.deleted.label} ${Language.lang.elements.messages.messageElem.deleted[data.deleted]}`
            textRow.addClass("deleted")
        } else {
            textRow.text = data.text
        }

        const specialsRow = new Elem("specials-row", msgBlock)
        specialsRow.switchVisible(false)

        const timeRow = new Elem("time-row", msgBlock)

        const editedIcon = new Icon("edit", timeRow.element, "edited-icon", "10x10")
        editedIcon.title = `${Language.lang.elements.messages.messageElem.editedAt} ${formatDate(data.editedAt)}`
        editedIcon.switchVisible(data.sentAt != data.editedAt && !data.deleted)

        const sent = new Elem("sent-at", timeRow.element)
        sent.text = formatDate(data.sentAt)

        if (User?.data?.username == data.user.username && !data.deleted) {
            const controlRow = new Elem("control-row", timeRow.element)

            this.editIcon = new Icon("edit", controlRow.element, "edit", "10x10")
            this.editIcon.addEvent("click", () => {
                new Alert.Input(null, Language.lang.elements.messages.messageElem.editMessage, async (v) => {
                    await API("PUT", handler, {
                        msgID: data.id,
                        newText: v
                    })
                }, null, "bigField", textRow.text, null, `${data.id}-EDIT`)
            })
            this.editIcon.title = Language.lang.elements.messages.messageElem.editMessage

            this.rmIcon = new Icon("cross", controlRow.element, "rm", "10x10")
            this.rmIcon.addEvent("click", () => {
                new Alert.Confirm(`"${textRow.text}"`, Language.lang.elements.messages.messageElem.removeMessage, async () => {
                    await API("DELETE", handler, {
                        msgID: data.id
                    })
                }, null, null, `${data.id}-DELETE`)
            })
            this.rmIcon.title = Language.lang.elements.messages.messageElem.removeMessage
        }

        WSController.listen(`messageUpdate-${data.id}`, (data) => {
            switch (data.action) {
                case "edit": {
                    textRow.text = data.newText
                    editedIcon.switchVisible(true)
                }; break;
                case "delete": {
                    textRow.text = `${Language.lang.elements.messages.messageElem.deleted.label} ${Language.lang.elements.messages.messageElem.deleted[data.deleter]}`
                    textRow.addClass("deleted")
                    this.editIcon.kill()
                    this.rmIcon.kill()
                }; break;
            }
        })
    }
}
