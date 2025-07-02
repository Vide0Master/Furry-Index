import Elem from "../../components/elem/script.js";
import Image from "../../components/image/script.js";
import Tag from "../../elements/tag/script.js";
import API from "../../scripts/api.js";
import formatDate from "../../scripts/formatDate.js";
import formatFileSize from "../../scripts/formatFileSize.js";

export const tag = "postView";
export const tagLimit = 10;

export async function render(params) {
    const container = new Elem('post-view-container')

    const postData = await API('GET', `/api/posts/${params.postID}`)
    if (postData.HTTPCODE != 200) {
        const errorElem = new Elem('error', container.element)
        switch (postData.HTTPCODE) {
            case 403: {
                errorElem.text = 'This post is not available'
            }; break
            default: {
                errorElem.text = 'Error loading post data'
            }; break;
        }
        return container.element;
    }

    const PData = postData.post
    console.log(PData)

    const postDataBlock = new Elem('post-data-block', container.element)

    const postTagsElem = new Elem('post-tags-column', postDataBlock.element)
    new Elem('tag-label', postTagsElem.element).text = 'Tags:'
    for (const tag of PData.tags) {
        new Tag(tag, postTagsElem.element)
    }

    const postUploadData = new Elem('post-upload-data', postDataBlock.element)
    const uploadedBy = new Elem('owner', postUploadData.element)
    uploadedBy.text = 'Uploaded by: ' + (PData.owner.visiblename ? PData.owner.visiblename : PData.owner.username)
    const uploadedOn = new Elem('when', postUploadData.element)
    uploadedOn.text = 'On: ' + formatDate(PData.createdOn)

    const fileDataContainer = new Elem('file-data-container', postDataBlock.element)

    const postimgContainer = new Elem('post-conatiner', container.element)

    const postLabel = new Elem('post-label', postimgContainer.element)

    const postName = new Elem('post-name', postLabel.element)
    postName.text = PData.name

    if (PData.description.length > 0) {
        const postDescription = new Elem('post-description', postLabel.element)
        postDescription.text = PData.description
    }

    switch (PData.type) {
        case 'image': {
            const file = PData.files[0]
            new Image(`/api/posts/${params.postID}/file/${file.fileid}`, 'post-image', postimgContainer.element)

            new Elem(null, fileDataContainer.element).text = `Resolution: ${file.fileparams.height}x${file.fileparams.width}px`
            new Elem(null, fileDataContainer.element).text = `Size: ${formatFileSize(file.fileparams.size)}`
        }; break;
        case 'imageGroup': {
            const files = PData.files
            const avgData = { x: 0, y: 0, s: 0 }

            for (let i = 0; i < files.length; i++) {
                const file = files[i]
                new Image(`/api/posts/${params.postID}/file/${file.fileid}`, 'post-image', postimgContainer.element)
                avgData.x += file.fileparams.width
                avgData.y += file.fileparams.height
                avgData.s += file.fileparams.size
            }

            avgData.x = avgData.x / files.length
            avgData.y = avgData.y / files.length
            avgData.s = avgData.s / files.length

            new Elem(null, fileDataContainer.element).text = `Resolution: ~${Math.floor(avgData.x)}x${Math.floor(avgData.y)}px`
            new Elem(null, fileDataContainer.element).text = `Size: ~${formatFileSize(avgData.s)}`
        }; break;
        case 'comic': {
            const files = PData.files
            const avgData = { x: 0, y: 0, s: 0 }

            for (let i = 0; i < files.length; i++) {
                const file = files[i]
                new Image(`/api/posts/${params.postID}/file/${file.fileid}`, 'post-image', postimgContainer.element)
                avgData.x += file.fileparams.width
                avgData.y += file.fileparams.height
                avgData.s += file.fileparams.size
            }

            avgData.x = avgData.x / files.length
            avgData.y = avgData.y / files.length
            avgData.s = avgData.s / files.length

            new Elem(null, fileDataContainer.element).text = `Resolution: ~${Math.floor(avgData.x)}x${Math.floor(avgData.y)}px`
            new Elem(null, fileDataContainer.element).text = `Size: ~${formatFileSize(avgData.s)}`
        }; break;
    }



    return container.element;
}
