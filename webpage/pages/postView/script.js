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

function capitalizeFirst(str) {
    if (!str) return '';
    return str[0].toUpperCase() + str.slice(1);
}

export const tag = "postView";
export const tagLimit = 10;

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
                    name: { ENG: 'Tags', UA: 'Мета', RU: 'Мета' },
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

function renderUploadData(owner, createdOn, parent) {
    const postUploadData = new Elem('post-upload-data', parent);
    const uploadedBy = new Elem('owner', postUploadData.element);
    new Elem('text', uploadedBy.element).text = Language.lang.postView.file.uploadedBy + ':'
    new Link(owner.visiblename ? owner.visiblename : '@' + owner.username, `/profile/${owner.username}`, uploadedBy.element, true)
    const uploadedOn = new Elem('when', postUploadData.element);
    uploadedOn.text = `${Language.lang.postView.file.uploadedOn}: ${formatDate(createdOn)}`;
}

function renderFileData(files, type, parent, postID, postimgContainer) {
    let avg = { width: 0, height: 0, size: 0 };
    let count = files.length;

    if (type === 'image' || type === 'video') count = 1;

    files.forEach(file => {
        if (type === 'video') {
            new Video(`/api/posts/${postID}/file/${file.id}`, postimgContainer.element);
        } else {
            new Image(`/api/posts/${postID}/file/${file.id}`, 'post-image', postimgContainer.element);
        }
        avg.width += file.fileparams.width;
        avg.height += file.fileparams.height;
        avg.size += file.fileparams.size;
    });

    avg.width = Math.floor(avg.width / count);
    avg.height = Math.floor(avg.height / count);
    avg.size = avg.size / count;

    let resolution = `${avg.height}x${avg.width}px`;
    let size = formatFileSize(avg.size);

    if (type === 'imageGroup' || type === 'comic') {
        resolution = `~${resolution}`;
        size = `~${size}`;
    }

    new Elem(null, parent.element).text = `${Language.lang.postView.file.resolution}: ${resolution}`;
    new Elem(null, parent.element).text = `${Language.lang.postView.file.size}: ${size}`;
}

function renderRating(ratingNm, dataBlock) {
    const rating = { txt: ratingNm, clr: '' }
    switch (ratingNm) {
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

    const ratingBlock = new Elem('rating-label-cont', dataBlock)
    new Elem('label', ratingBlock.element).text = Language.lang.postView.rating

    new TextLabel(rating.txt, ratingBlock.element, rating.clr, true)
}

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

    renderTags(PData.tags, postDataBlock.element);
    renderUploadData(PData.owner, PData.createdOn, postDataBlock.element);
    renderRating(PData.rating, postDataBlock.element)

    const fileDataContainer = new Elem('file-data-container', postDataBlock.element);
    const postimgContainer = new Elem('post-conatiner', container.element);
    const postLabel = new Elem('post-label', postimgContainer.element);

    new Elem('post-name', postLabel.element).text = PData.name;
    if (PData.description.length > 0) {
        new Elem('post-description', postLabel.element).text = PData.description;
    }

    if (['image', 'imageGroup', 'comic', 'video'].includes(PData.type)) {
        renderFileData(PData.files, PData.type, fileDataContainer, params.postID, postimgContainer);
    }

    if (!PData.visible) {
        new Elem(null, postDataBlock.element).text = Language.lang.postView.hiddenLabel;
    }

    return container.element;
}
