import BigTextField from "../../components/bigtextfield/script.js";
import Button from "../../components/button/script.js";
import Elem from "../../components/elem/script.js";
import API from "../../scripts/api.js";
import Language from "../../scripts/language.js";
import User from "../../scripts/userdata.js";
import WSController from "../../scripts/ws.js";
import MessageBlock from "./messageBlock/script.js";

export default class MessageBox extends Elem {
    constructor(parent, handler) {
        super('internal-message-box', parent)

        this.msgHandler = handler

        this.chatBox = new Elem('chat-cont', this.element)

        const noMessages = new Elem('no-msg-txt', this.chatBox.element)
        noMessages.text = Language.lang.elements.messages.noMsg

        const getMessages = async (page, take) => {
            const params = new URLSearchParams();
            if (page) params.append('page', page);
            if (take) params.append('take', take);

            const url = `${handler}?${params.toString()}`;

            const chat = await API('get', url);

            if (chat.chat?.chatMessages) {
                for (const msg of chat.chat.chatMessages) {
                    new MessageBlock(this.chatBox.element, msg, handler)
                    noMessages.switchVisible(false)
                }
            }
        }

        getMessages()

        if (User.data) {
            this.messageBox = new Elem('message-cont', this.element)

            const txtInp = new BigTextField(Language.lang.elements.messages.message, this.messageBox.element)

            const sendBtn = new Button(Language.lang.elements.messages.send, this.messageBox.element, 'null', async () => {
                await API('POST', handler, { text: txtInp.input, specialData: {} })
                txtInp.input = ''
            })
        }

        WSController.listen('newMessage', (data) => {
            console.log(data)
            const msg = new MessageBlock(this.chatBox.element, data.message, handler)
            this.chatBox.element.prepend(msg.element)
            noMessages.switchVisible(false)
        })
    }
}