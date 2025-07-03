import Button from "../../components/button/script.js";
import Elem from "../../components/elem/script.js";
import Image from "../../components/image/script.js";
import Link from "../../components/link/script.js";
import SwitchInput from "../../components/switchinput/script.js";
import Alert from "../../features/alert/script.js";
import API from "../../scripts/api.js";
import makePostMaker from "../postMaker/script.js";
import Tag from "../tag/script.js";

export default class PostCard {
    constructor(postData, parent, isInEditor = false, updateEditorCB) {
        this.element = new Elem('post-card', parent)

        const previewContainer = new Elem('preview-container', this.element.element)

        switch (postData.type) {
            case 'imageGroup': {
                const slidingCont = new Elem('sliding-images-container', previewContainer.element)

                postData.files = postData.files.slice().reverse()

                const filesCount = postData.files.length <= 5 ? postData.files.length : 5
                for (let i = 0; i < filesCount; i++) {
                    const img = new Image(`/api/posts/${postData.id}/file/${postData.files[i].fileid}?thumbnail=500`, 'post-image', slidingCont.element)

                    img.element.style = `--shift: ${200 - (200 / filesCount) - (200 / filesCount * i)}px; --width-shift: ${(200 / filesCount)}px;`
                }
            }; break;
            default: {
                new Image(`/api/posts/${postData.id}/file/${postData.files[0].fileid}?thumbnail=500`, 'post-image', previewContainer.element)
            }; break;
        }

        this.name = new Elem('post-name', this.element.element)
        this.name.text = postData.name

        this.tagrow = new Elem('tag-row', this.element.element)
        for (const tag of postData.tags) {
            new Tag(tag, this.tagrow.element)
        }

        if (isInEditor) {
            const visSwitch = new SwitchInput('Visible', this.element.element, async (state) => {
                const result = await API('PUT', `/api/posts/${postData.id}`, { visible: state })
                if (!result.updated) visSwitch.change()
            }, postData.visible)

            const editButton = new Button('Edit', this.element.element, null, () => {
                makePostMaker(postData, updateEditorCB)
            })

            const removeBtn = new Button('Remove', this.element.element, null, async () => {
                const rmresult = await API('DELETE', `/api/posts/${postData.id}`, null, true)
                if (rmresult.HTTPCODE == 200) {
                    new Alert.SimpleAlert(`Post "${postData.id}" removed`, 'Success', 5000, null, 'removed' + postData.id)
                    this.element.element.remove()
                }
            })
        }

        if (!isInEditor) {
            const postlink = new Link(null, `/post/${postData.id}`, null, true, 'post-link')
            postlink.textElem.element.remove()

            this.element.element.addEventListener('click', () => {
                postlink.element.click()
            })
        }
    }
}
