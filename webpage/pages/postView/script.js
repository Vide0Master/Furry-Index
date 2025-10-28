import Button from "../../components/button/script.js";
import Elem from "../../components/elem/script.js";
import Image from "../../components/image/script.js";
import Video from "../../components/video/script.js";
import Tag from "../../elements/tag/script.js";
import TextLabel from "../../elements/textLabel/script.js";
import API from "../../scripts/api.js";
import formatDate from "../../scripts/formatDate.js";
import formatFileSize from "../../scripts/formatFileSize.js";
import Language from "../../scripts/language.js";
import User from "../../scripts/userdata.js";
import makePostMaker from "../../elements/postMaker/script.js";
import Router from "../../scripts/router.js";
import Favourites from "../../scripts/favouriteControl.js";
import PageNavigator from "../../elements/pagenavigator/script.js";
import MessageBox from "../../elements/messages/script.js";
import UserCard from "../../elements/userCard/script.js";
import SearchField from "../../elements/searchfield/script.js";
import formatDuration from "../../scripts/formatDuration.js";
import Icon from "../../components/icon/script.js";
import ReportOverlay from "../../features/report/script.js";
import Link from "../../components/link/script.js";

function capitalizeFirst(str) {
    if (!str) return "";
    return str[0].toUpperCase() + str.slice(1);
}

export const tag = "postView";
export const tagLimit = 10;

export async function render(params) {
    const container = new Elem("post-view-container");
    const postData = await API("GET", `/api/posts/${params.postID}`);

    if (!User.Settings.get("contentFiler", "p")[postData.post.rating].show && postData.post.owner.username != User.data.username) postData.HTTPCODE = 403

    if (postData.HTTPCODE !== 200) {
        const errorElem = new Elem("error", container.element);
        errorElem.text = postData.HTTPCODE === 403
            ? Language.lang.postView.errors.noAccess
            : Language.lang.postView.errors.default;
        return container.element;
    }

    const PData = postData.post;

    Router.setTitle(PData.name + " " + Language.lang.postView.by + " " + (PData.owner.visiblename ? PData.owner.visiblename : `@${PData.owner.username}`))

    const postDataBlock = new Elem("post-data-block", container.element);

    new UserCard(postDataBlock.element, PData.owner, "default", ["shrinkName"])

    if (!PData.visible) {
        new Elem("visible-field", postDataBlock.element).text = Language.lang.postView.hiddenLabel;
    }

    //render tags
    renderTags(PData.tags, postDataBlock.element);

    new Link(Language.lang.features.report.label, () => { new ReportOverlay({ exc: ["inappropriateBehaviour", "scam", "fraud", "accountAccess"], data: { post: PData } }) }, new Elem("report-cont", postDataBlock), null, null, "shield")

    //region upload data
    const postUploadData = new Elem("post-upload-data", postDataBlock.element);
    const uploadedOn = new Elem("when", postUploadData.element);
    uploadedOn.text = `${Language.lang.postView.file.uploadedOn}: ${formatDate(PData.createdOn)}`;

    //region age rating
    const rating = { txt: PData.rating, clr: "" }
    switch (PData.rating) {
        case "safe": {
            rating.clr = "greenyellow"
            rating.txt = Language.lang.elements.postCard.rating.safe;
        }; break;
        case "questionable": {
            rating.clr = "gold"
            rating.txt = Language.lang.elements.postCard.rating.questionable;
        }; break;
        case "explicit": {
            rating.clr = "red"
            rating.txt = Language.lang.elements.postCard.rating.explicit;
        }; break;
    }

    const ageRatingBlock = new Elem("rating-label-cont", postDataBlock.element)
    new Elem("label", ageRatingBlock.element).text = Language.lang.postView.rating
    new TextLabel(rating.txt, ageRatingBlock.element, rating.clr, true)

    //region post files
    const postimgContainer = new Elem("post-conatiner", container.element);

    if (typeof params.query?.tags == "string") {
        const nav = await API("GET", `/api/posts/${params.postID}/navigation${window.location.search}`)
        const searchNav = new SearchField(postimgContainer.element, "/api/posts/tags", nav)

        const URLparams = new URLSearchParams(window.location.search)
        const tagsParams = URLparams.get("tags")
        if (tagsParams) {
            searchNav.setSearch(tagsParams.split("+").filter(v => v != "").join(" "))
        }

        searchNav.addSearchCB((tags) => {
            Router.navigate(`/search?tags=${tags.join("+")}`)
        })
    }

    const postLabel = new Elem("post-label", postimgContainer.element);

    new Elem("post-name", postLabel.element).text = PData.name;
    if (PData.description.length > 0) {
        new Elem("post-description", postLabel.element).text = PData.description;
    }

    if (["image", "imageGroup", "comic", "video", "videoGroup"].includes(PData.type)) {
        const isBlurred = User.Settings.get("contentFiler", "p")[PData.rating].blur || !User.Settings.get("contentFiler", "p")[postData.post.rating].show ? { text: true } : false

        const fileContainer = new Elem("files-cont", postimgContainer.element)

        const filesElems = []

        const fileParams = []

        //region post files render
        PData.files.forEach(file => {
            if (["video", "videoGroup"].includes(PData.type)) {
                filesElems.push(new Video(`/api/posts/${params.postID}/file/${file.id}`, fileContainer.element, null, isBlurred))
            } else {
                filesElems.push(new Image(`/api/posts/${params.postID}/file/${file.id}`, "post-image", fileContainer.element, isBlurred))
            }

            //region post stats
            fileParams.push({ id: file.id, ...file.fileparams, fileType: file.filetype })
        });

        if (filesElems.length > 1) {
            for (let i = 1; i < filesElems.length; i++) {
                filesElems[i].switchVisible(false)
            }

            const pageNav = new PageNavigator(filesElems.length, 1, fileContainer.element, true)

            pageNav.addNavCB((page) => {
                for (const elem of filesElems) {
                    elem.switchVisible(false)
                }
                filesElems[page - 1].switchVisible(true)
                pageNav.renderButtons(filesElems.length, page)
            })
        }

        const fileDataContainer = new Elem("file-data-container", postDataBlock.element);

        new Elem("post-files-label", fileDataContainer.element).text = Language.lang.postView.file.filesData[fileParams.length > 1 ? "labelS" : "label"]

        for (const fileDatID in fileParams) {
            const fileDat = fileParams[fileDatID]
            const dataBlock = new Elem("file-data-block", fileDataContainer.element)
            const fileName = new Elem("file-name", dataBlock)
            if (fileParams.length > 1) new Elem("counter", fileName).text = parseInt(fileDatID) + 1
            new Elem("file-name-text", fileName).text = fileDat.id.split("-")[0]
            new Icon(fileDat.fileType == "mp4" ? "video" : "image", new Elem("icon-cont", fileName))
            new Elem("data-line", dataBlock).text = `${Language.lang.postView.file.filesData.resolution}: ${fileDat.width}x${fileDat.height}px`
            if (fileDat.duration) new Elem("data-line", dataBlock).text = `${Language.lang.postView.file.filesData.duration}: ${formatDuration(fileDat.duration)}`
            new Elem("data-line", dataBlock).text = `${Language.lang.postView.file.filesData.size}: ${formatFileSize(fileDat.size)}`
        }
    }

    const controlBlock = new Elem("control-block", postimgContainer.element)

    //region rating
    const ratingBlock = new Elem("rating-block", controlBlock.element)
    const scoreTextCont = new Elem("score-text-cont", ratingBlock.element)
    const scoreText = new Elem("score-text", scoreTextCont.element)
    const upBtn = new Button("▲", ratingBlock.element, "btn-up", () => { updateScore("up") })
    const downBtn = new Button("▼", ratingBlock.element, "btn-down", () => { updateScore("down") })

    scoreTextCont.moveAfter(upBtn.element)

    function setScore(val) {
        scoreText.text = val
        scoreText.element.classList.remove("up", "down")
        scoreText.element.classList.add(parseInt(val) >= 0 ? "up" : "down")
    }

    setScore(PData.score)

    let currentType = ""

    function setButtonState(state) {
        currentType = state
        upBtn.element.classList.toggle("active", false)
        downBtn.element.classList.toggle("active", false)
        if (state == "up") upBtn.element.classList.toggle("active", true)
        if (state == "down") downBtn.element.classList.toggle("active", true)
    }

    setButtonState(PData.ownscore)

    async function updateScore(type) {
        if (currentType == type) {
            const resp = await API("DELETE", `/api/post/${PData.id}/score`)
            setButtonState(resp.state)
            setScore(resp.score)
        } else {
            const resp = await API("POST", `/api/post/${PData.id}/score`, { type })
            setButtonState(resp.state)
            setScore(resp.score)
        }
    }

    if (User.data == null) {
        upBtn.enabled = false
        downBtn.enabled = false
        scoreTextCont.addClass("disabled")
    }

    //region fav
    let favstate = PData.myfav || (await Favourites.includes(PData.id))

    const favBtn = new Button(null, controlBlock.element, "fav-btn")
    new Elem("heart", favBtn.element).text = "❤︎"
    const favCount = new Elem("fav-count", favBtn.element)
    favCount.text = PData.favourites
    favBtn.element.classList.toggle("faved", favstate)

    favBtn.addEvent("click", async () => {
        let cnt = null
        if (!favstate) {
            cnt = await Favourites.add(PData.id)
        } else {
            cnt = await Favourites.rm(PData.id)
        }

        if (cnt !== true && typeof cnt != "number") return

        favstate = !favstate

        favBtn.element.classList.toggle("faved", favstate)

        if (cnt != null && typeof cnt == "number") favCount.text = cnt
    })

    //region edit
    if (PData.ownerid == User?.data?.id) {
        new Button(Language.lang.elements.postCard.editButtons.edit, controlBlock.element, null, () => {
            makePostMaker(PData, () => {
                Router.navigate(`/post/${PData.id}`, false, true)
            })
        })
    }

    new MessageBox(container.element, `/api/posts/${PData.id}/messages`)

    return container.element;
}

//region tag render
function renderTags(tags, parent) {
    const groups = [];

    for (const tag of tags) {
        const basename = typeof tag.group?.basename === "string"
            ? tag.group.basename
            : "default";

        const groupIndex = groups.findIndex(g => g.basename === basename);

        if (groupIndex === -1) {
            const groupObj = tag.group
                ? { ...tag.group }
                : {
                    basename: "default",
                    name: { ENG: "Tags", UA: "Теги", RU: "Теги" },
                    priority: 0,
                    color: "#5b34eb"
                };

            groupObj.tags = [{
                name: tag.name,
                count: tag.count,
                group: {
                    basename: groupObj.basename,
                    name: groupObj.name,
                    color: groupObj.color
                }
            }];

            groups.push(groupObj);
        } else {
            const existing = groups[groupIndex];
            existing.tags.push({
                name: tag.name,
                count: tag.count,
                group: {
                    basename: existing.basename,
                    name: existing.name,
                    color: existing.color
                }
            });
        }
    }

    for (const group of groups) {
        group.tags.sort((a, b) => b.count - a.count);
    }

    groups.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));

    const postTagsElem = new Elem("post-tags-column", parent);

    for (const group of groups) {
        const tagsBlock = new Elem("tags-block", postTagsElem.element);

        new Elem("tag-group-label", tagsBlock.element).text = group.name[Language.currentLang] ? group.name[Language.currentLang] : capitalizeFirst(group.basename);

        for (const tag of group.tags) {
            new Tag(tag, tagsBlock.element, true, `/search`);
        }
    }
}
