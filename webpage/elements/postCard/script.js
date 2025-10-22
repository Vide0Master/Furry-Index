import Button from "../../components/button/script.js";
import Elem from "../../components/elem/script.js";
import Image from "../../components/image/script.js";
import SwitchInput from "../../components/switchinput/script.js";
import Alert from "../../features/alert/script.js";
import API from "../../scripts/api.js";
import makePostMaker from "../postMaker/script.js";
import Language from "../../scripts/language.js";
import Router from "../../scripts/router.js";
import Icon from "../../components/icon/script.js";
import User from "../../scripts/userdata.js";

export default class PostCard extends Elem {
    constructor(postData, parent, isInEditor = false, updateEditorCB) {
        super("post-card", parent)

        const previewContainer = new Elem("preview-container", this.element)

        const isBlurred = User.Settings.get("contentFiler", "p")[postData.rating].blur || !User.Settings.get("contentFiler", "p")[postData.rating].show

        switch (postData.type) {
            case "videoGroup":
            case "imageGroup": {
                const barsControl = new Elem("group-bars-container", previewContainer.element)

                postData.files = postData.files.slice()
                const imgs = []
                for (const file of postData.files) {
                    const img = new Image(`/api/posts/${postData.id}/file/${file.id}?thumbnail=500`, null, previewContainer.element, isBlurred)
                    imgs.push(img)
                    img.addClass("img-hide")
                    const showBar = new Elem("control-bar", barsControl.element)
                    showBar.addEvent("mouseover", () => {
                        imgs.forEach(img => img.addClass("img-hide"))
                        img.rmClass("img-hide")
                    })
                }
                imgs[0].rmClass("img-hide")

                barsControl.moveAfter(imgs[imgs.length - 1].element)

                this.addEvent("mouseleave", () => {
                    imgs.forEach(img => img.addClass("img-hide"))
                    imgs[0].rmClass("img-hide")
                })
            }; break;
            default: {
                new Image(`/api/posts/${postData.id}/file/${postData.files[0].id}?thumbnail=500`, "post-image", previewContainer.element, isBlurred)
            }; break;
        }

        this.name = new Elem("post-name", this.element)
        const isVisibleIcon = new Icon("non-visible", this.name.element)
        isVisibleIcon.element.title = Language.lang.postView.hiddenLabel
        new Elem("text", this.name.element).text += postData.name
        isVisibleIcon.switchVisible(!postData.visible)

        // this.tagrow = new Elem('tag-row', this.element)
        // for (const tag of postData.tags) {
        //     new Tag(tag, this.tagrow.element)
        // }

        // const rating = { txt: postData.rating, clr: "" }
        // switch (postData.rating) {
        //     case "safe": {
        //         rating.clr = "greenyellow"
        //         rating.txt = Language.lang.elements.postCard.rating.safe;
        //     }; break;
        //     case "questionable": {
        //         rating.clr = "rgb(255, 170, 0)"
        //         rating.txt = Language.lang.elements.postCard.rating.questionable;
        //     }; break;
        //     case "explicit": {
        //         rating.clr = "red"
        //         rating.txt = Language.lang.elements.postCard.rating.explicit;
        //     }; break;
        // }

        // const ratingLabel = new TextLabel(rating.txt, this.element, rating.clr, true)
        // ratingLabel.addClass("rating-label")

        const smallDataField = new Elem("small-data-field", this.element)
        const scoreText = new Elem("score-text", smallDataField.element)
        scoreText.text = `${postData.score >= 0 ? "▲" : "▼"} ${postData.score}`
        scoreText.title = Language.lang.elements.postCard.score
        scoreText.element.classList.add(postData.score >= 0 ? "up" : "down")

        if (postData.favourites > 0) {
            const favsElem = new Elem("favs-elem", smallDataField.element)
            favsElem.title = Language.lang.elements.postCard.favs
            const heart = new Elem("fav-heart", favsElem.element)
            heart.text = "❤︎"
            if (postData.myfav) heart.addClass("fav")
            new Elem("text", favsElem.element).text = postData.favourites
        }

        previewContainer.addEvent("click", () => {
            Router.navigate(`/post/${postData.id}${window.location.search}`, this.element)
        })

        if (isInEditor) {
            const openButtons = new Elem("open-buttons-overlay", this.element)
            new Icon("list", openButtons.element,null,"25x25")

            const buttonCont = new Elem("edit-buttons-col", this.element)
            document.addEventListener("click", (e) => {
                if (!buttonCont.element.contains(e.target) && !openButtons.element.contains(e.target)) {
                    buttonCont.rmClass("active")
                }
            })

            openButtons.addEvent("click", () => {
                buttonCont.addClass("active")
            })

            const visSwitch = new SwitchInput(Language.lang.elements.postCard.editButtons.visible, buttonCont.element, async (state) => {
                const result = await API("PUT", `/api/posts/${postData.id}`, { visible: state })

                if (!result.updated) {
                    visSwitch.change()
                } else {
                    isVisibleIcon.switchVisible(!state)
                }
            }, postData.visible)

            new Button(Language.lang.elements.postCard.editButtons.remove, buttonCont.element, null, async () => {
                new Alert.Confirm(Language.lang.elements.postCard.editButtons.rmAlert.text, Language.lang.elements.postCard.editButtons.rmAlert.label, async () => {
                    const rmresult = await API("DELETE", `/api/posts/${postData.id}`, null, true)
                    if (rmresult.HTTPCODE == 200) {
                        new Alert.Simple(`${Language.lang.elements.postCard.editButtons.successRM[0]} "${postData.id}" ${Language.lang.elements.postCard.editButtons.successRM[1]}`, null, 5000, null, "removed" + postData.id)
                        this.element.remove()
                    }
                }, null, null, "remove-post-confirm-" + postData.id)
            })

            new Button(Language.lang.elements.postCard.editButtons.edit, buttonCont.element, null, () => {
                makePostMaker(postData, updateEditorCB)
            })
        }
    }
}
