import Button from "../../components/button/script.js";
import Elem from "../../components/elem/script.js";
import Image from "../../components/image/script.js";
import SwitchInput from "../../components/switchinput/script.js";
import Alert from "../../features/alert/script.js";
import API from "../../scripts/api.js";
import makePostMaker from "../postMaker/script.js";
import TextLabel from "../textLabel/script.js";
import Language from "../../scripts/language.js";
import Router from "../../scripts/router.js";
import Icon from "../../components/icon/script.js";

export default class PostCard extends Elem {
    constructor(postData, parent, isInEditor = false, updateEditorCB) {
        super('post-card', parent)

        const previewContainer = new Elem('preview-container', this.element)

        switch (postData.type) {
            case 'imageGroup': {
                const slidingCont = new Elem('sliding-images-container', previewContainer.element)

                postData.files = postData.files.slice().reverse()

                const filesCount = postData.files.length <= 5 ? postData.files.length : 5
                for (let i = 0; i < filesCount; i++) {
                    const img = new Image(`/api/posts/${postData.id}/file/${postData.files[i].id}?thumbnail=500`, 'post-image', slidingCont.element)
                    const width = 160
                    img.element.style = `--shift: ${width - (width / filesCount) - (width / filesCount * i)}px; --width-shift: ${(width / filesCount)}px;`
                }
            }; break;
            default: {
                new Image(`/api/posts/${postData.id}/file/${postData.files[0].id}?thumbnail=500`, 'post-image', previewContainer.element)
            }; break;
        }

        this.name = new Elem('post-name', this.element)
        const isVisibleIcon = new Icon('non-visible', this.name.element)
        isVisibleIcon.element.title = Language.lang.postView.hiddenLabel
        new Elem('text', this.name.element).text += postData.name

        isVisibleIcon.switchVisible(!postData.visible)

        // this.tagrow = new Elem('tag-row', this.element)
        // for (const tag of postData.tags) {
        //     new Tag(tag, this.tagrow.element)
        // }

        const rating = { txt: postData.rating, clr: '' }
        switch (postData.rating) {
            case 'safe': {
                rating.clr = 'greenyellow'
                rating.txt = Language.lang.elements.postCard.rating.safe;
            }; break;
            case 'questionable': {
                rating.clr = 'gold'
                rating.txt = Language.lang.elements.postCard.rating.questionable;
            }; break;
            case 'mature': {
                rating.clr = 'red'
                rating.txt = Language.lang.elements.postCard.rating.mature;
            }; break;
        }

        new TextLabel(rating.txt, this.element, rating.clr, true)

        const smallDataField = new Elem('small-data-field', this.element)
        const scoreText = new Elem('score-text', smallDataField.element)
        scoreText.text = `${postData.score >= 0 ? '▲' : '▼'} ${postData.score}`
        scoreText.title = Language.lang.elements.postCard.score
        scoreText.element.classList.add(postData.score >= 0 ? 'up' : 'down')

        if (postData.favourites > 0) {
            const favsElem = new Elem('favs-elem', smallDataField.element)
            favsElem.text = '❤︎ ' + postData.favourites
            favsElem.title = Language.lang.elements.postCard.favs
        }

        if (isInEditor) {
            const buttonCont = new Elem('edit-buttons-row', this.element)

            const visSwitch = new SwitchInput(Language.lang.elements.postCard.editButtons.visible, buttonCont.element, async (state) => {
                const result = await API('PUT', `/api/posts/${postData.id}`, { visible: state })

                if (!result.updated) {
                    visSwitch.change()
                } else {
                    isVisibleIcon.switchVisible(!state)
                }
            }, postData.visible)

            new Button(Language.lang.elements.postCard.editButtons.remove, buttonCont.element, null, async () => {
                new Alert.Confirm('Are you sure you want to remove this post?', 'Remove post', async () => {
                    const rmresult = await API('DELETE', `/api/posts/${postData.id}`, null, true)
                    if (rmresult.HTTPCODE == 200) {
                        new Alert.Simple(`${Language.lang.elements.postCard.editButtons.successRM[0]} "${postData.id}" ${Language.lang.elements.postCard.editButtons.successRM[1]}`, null, 5000, null, 'removed' + postData.id)
                        this.element.remove()
                    }
                }, null, null, 'remove-post-confirm-' + postData.id)
            })

            new Button(Language.lang.elements.postCard.editButtons.edit, buttonCont.element, null, () => {
                makePostMaker(postData, updateEditorCB)
            })
        }

        if (!isInEditor) {
            previewContainer.addEvent('click', () => {
                Router.navigate(`/post/${postData.id}`, this.element)
            })
        }
    }
}
