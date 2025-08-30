import Button from "../../components/button/script.js";
import Elem from "../../components/elem/script.js";
import Image from "../../components/image/script.js";
import Link from "../../components/link/script.js";
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

function capitalizeFirst(str) {
    if (!str) return '';
    return str[0].toUpperCase() + str.slice(1);
}

export const tag = "postView";
export const tagLimit = 10;

export async function render(params) {
    const container = new Elem('post-view-container');
    const postData = await API('GET', `/api/posts/${params.postID}`);

    if (postData.HTTPCODE !== 200) {
        const errorElem = new Elem('error', container.element);
        errorElem.text = postData.HTTPCODE === 403
            ? Language.lang.postView.errors.noAccess
            : Language.lang.postView.errors.default;
        return container.element;
    }

    const PData = postData.post;
    const postDataBlock = new Elem('post-data-block', container.element);

    new UserCard(postDataBlock.element, PData.owner)

    //render tags
    renderTags(PData.tags, postDataBlock.element);


    //region upload data
    const postUploadData = new Elem('post-upload-data', postDataBlock.element);
    const uploadedOn = new Elem('when', postUploadData.element);
    uploadedOn.text = `${Language.lang.postView.file.uploadedOn}: ${formatDate(PData.createdOn)}`;


    //region age rating
    const rating = { txt: PData.rating, clr: '' }
    switch (PData.rating) {
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

    const ageRatingBlock = new Elem('rating-label-cont', postDataBlock.element)
    new Elem('label', ageRatingBlock.element).text = Language.lang.postView.rating
    new TextLabel(rating.txt, ageRatingBlock.element, rating.clr, true)


    //region post file data
    const fileDataContainer = new Elem('file-data-container', postDataBlock.element);
    const postimgContainer = new Elem('post-conatiner', container.element);
    const postLabel = new Elem('post-label', postimgContainer.element);

    new Elem('post-name', postLabel.element).text = PData.name;
    if (PData.description.length > 0) {
        new Elem('post-description', postLabel.element).text = PData.description;
    }

    if (['image', 'imageGroup', 'comic', 'video'].includes(PData.type)) {
        const isBlurred = !User.data && ['mature', 'questionable'].includes(PData.rating)

        let avg = { width: 0, height: 0, size: 0 };
        let count = PData.files.length;

        if (['image', 'video'].includes(PData.type)) count = 1;

        const fileContainer = new Elem('files-cont', postimgContainer.element)

        const filesElems = []

        PData.files.forEach(file => {
            if (PData.type === 'video') {
                filesElems.push(new Video(`/api/posts/${params.postID}/file/${file.id}`, fileContainer.element, null, isBlurred ? { text: true } : false))
            } else {
                filesElems.push(new Image(`/api/posts/${params.postID}/file/${file.id}`, 'post-image', fileContainer.element, isBlurred ? { text: true } : false))
            }
            avg.width += file.fileparams.width;
            avg.height += file.fileparams.height;
            avg.size += file.fileparams.size;
        });

        if (filesElems.length > 1) {
            for (let i = 1; i < filesElems.length; i++) {
                filesElems[i].switchVisible(false)
            }

            const pageNav = new PageNavigator(filesElems.length, 1, fileContainer.element)

            pageNav.addNavCB((page) => {
                for (const elem of filesElems) {
                    elem.switchVisible(false)
                }
                filesElems[page - 1].switchVisible(true)
                pageNav.renderButtons(filesElems.length, page)
            })
        }

        avg.width = Math.floor(avg.width / count);
        avg.height = Math.floor(avg.height / count);
        avg.size = avg.size / count;

        let resolution = `${avg.height}x${avg.width}px`;
        let size = formatFileSize(avg.size);

        if (PData.type === 'imageGroup' || PData.type === 'comic') {
            resolution = `~${resolution}`;
            size = `~${size}`;
        }

        new Elem(null, fileDataContainer.element).text = `${Language.lang.postView.file.resolution}: ${resolution}`;
        new Elem(null, fileDataContainer.element).text = `${Language.lang.postView.file.size}: ${size}`;
    }

    const controlBlock = new Elem('control-block', postimgContainer.element)

    const ratingBlock = new Elem('rating-block', controlBlock.element)
    const scoreTextCont = new Elem('score-text-cont', ratingBlock.element)
    const scoreText = new Elem('score-text', scoreTextCont.element)
    const upBtn = new Button('▲', ratingBlock.element, 'btn-up', () => { updateScore('up') })
    const downBtn = new Button('▼', ratingBlock.element, 'btn-down', () => { updateScore('down') })

    scoreTextCont.moveAfter(upBtn.element)

    function setScore(val) {
        scoreText.text = val
        scoreText.element.classList.remove('up', 'down')
        scoreText.element.classList.add(parseInt(val) >= 0 ? 'up' : 'down')
    }

    setScore(PData.score)

    let currentType = ''

    function setButtonState(state) {
        currentType = state
        upBtn.element.classList.toggle('active', false)
        downBtn.element.classList.toggle('active', false)
        if (state == 'up') upBtn.element.classList.toggle('active', true)
        if (state == 'down') downBtn.element.classList.toggle('active', true)
    }

    setButtonState(PData.ownscore)

    async function updateScore(type) {
        if (currentType == type) {
            const resp = await API('DELETE', `/api/post/${PData.id}/score`)
            setButtonState(resp.state)
            setScore(resp.score)
        } else {
            const resp = await API('POST', `/api/post/${PData.id}/score`, { type })
            setButtonState(resp.state)
            setScore(resp.score)
        }
    }

    if (User.data == null) {
        upBtn.element.disabled = true
        downBtn.element.disabled = true
    }

    let favstate = PData.myfav || (await Favourites.includes(PData.id))

    const favBtn = new Button(null, controlBlock.element, 'fav-btn')
    new Elem('heart', favBtn.element).text = '❤︎'
    const favCount = new Elem('fav-count', favBtn.element)
    favCount.text = PData.favourites
    favBtn.element.classList.toggle('faved', favstate)

    favBtn.addEvent('click', async () => {
        let cnt = null
        if (!favstate) {
            cnt = await Favourites.add(PData.id)
        } else {
            cnt = await Favourites.rm(PData.id)
        }

        if (cnt !== true && typeof cnt != 'number') return

        favstate = !favstate

        favBtn.element.classList.toggle('faved', favstate)

        if (cnt != null && typeof cnt == 'number') favCount.text = cnt
    })

    if (PData.ownerid == User?.data?.id) {
        new Button(Language.lang.elements.postCard.editButtons.edit, controlBlock.element, null, () => {
            makePostMaker(PData, () => {
                Router.navigate(`/post/${PData.id}`, false, true)
            })
        })
    }

    if (!PData.visible) {
        new Elem(null, postDataBlock.element).text = Language.lang.postView.hiddenLabel;
    }

    const commentSection = new MessageBox(container.element, `/api/posts/${PData.id}/messages`)

    return container.element;
}

function renderTags(tags, parent) {
    const groups = [];

    for (const tag of tags) {
        const basename = typeof tag.group?.basename === 'string'
            ? tag.group.basename
            : 'default';

        const groupIndex = groups.findIndex(g => g.basename === basename);

        if (groupIndex === -1) {
            const groupObj = tag.group
                ? { ...tag.group }
                : {
                    basename: 'default',
                    name: { ENG: 'Tags', UA: 'Теги', RU: 'Теги' },
                    priority: 0,
                    color: '#5b34eb'
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

    const postTagsElem = new Elem('post-tags-column', parent);

    for (const group of groups) {
        const tagsBlock = new Elem('tags-block', postTagsElem.element);

        new Elem('tag-group-label', tagsBlock.element).text = !!group.name[Language.currentLang] ? group.name[Language.currentLang] : capitalizeFirst(group.basename);

        for (const tag of group.tags) {
            new Tag(tag, tagsBlock.element);
        }
    }
}