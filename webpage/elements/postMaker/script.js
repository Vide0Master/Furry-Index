import Button from "../../components/button/script.js";
import Elem from "../../components/elem/script.js";
import DropdownList from "../../components/dropdownList/script.js";
import SwitchInput from "../../components/switchinput/script.js";
import TextInputLine from "../../components/textinputline/script.js";
import FileCard from "../../elements/fileCard/script.js";
import Alert from "../../features/alert/script.js";
import Overlay from "../../features/overlay/script.js";
import API from "../../scripts/api.js";

export default async function makePostMaker(postData, editedCB) {
    const overlay = new Overlay()

    const container = new Elem('postmaster-create-post-container', overlay.element)

    console.log(postData)

    const PostData = {
        name: postData?.name || '',
        description: postData?.description || '',
        type: postData?.type || '',
        rating: postData?.rating || '',
        files: postData?.files || []
    }

    const postname = new TextInputLine('Post name', container.element, null, null, (value) => {
        PostData.name = value
    })
    postname.input.value = PostData.name != '' ? PostData.name : ''

    const postdesc = new TextInputLine('Post desctiption', container.element, null, null, (value) => {
        PostData.description = value
    })
    postdesc.input.value = PostData.description != '' ? PostData.description : ''

    new DropdownList(
        (await API('GET', '/api/posts/data?q=rating', null, true)).types.map(val => ({ name: val, value: val })),
        container.element, 'Post rating', (val) => { PostData.rating = val }
    ).element.value = PostData.rating != '' ? PostData.rating : 'placeholder'

    const postType = new DropdownList(
        (await API('GET', '/api/posts/data?q=types', null, true)).types.map(val => ({ name: val, value: val })),
        container.element, 'Post type', getFiles
    )
    postType.element.value = PostData.type != '' ? PostData.type : 'placeholder'
    
    const filesField = new Elem(['files-list', 'hidden'], container.element)

    async function getFiles(type) {
        PostData.files = []
        PostData.type = type
        filesField.element.innerHTML = ''

        const tags = []
        if (['image', 'imageGroup', 'comic'].includes(type)) {
            tags.push('image')
        } else if (['video'].includes(type)) {
            tags.push('animated')
        }

        const files = await API('GET', `/api/file-manager?inuse=false&t=10${tags.length > 0 ? '&tags=' + tags.join('+') : ''}`)
        if (files.files.length == 0) {
            filesField.element.classList.toggle('hidden', true)
            return
        } else {
            filesField.element.classList.toggle('hidden', false)
        }

        const switches = {}

        for (const file of files.files) {
            const fcard = new FileCard(file, false, filesField.element, { remove: false })
            switches[file.fileid] = new SwitchInput('Include', fcard.element.element, (state) => {
                if (['image', 'video'].includes(type)) {
                    for (const fileid in switches) {
                        if (fileid == file.fileid) continue
                        switches[fileid].change(false)
                    }

                    if (state) {
                        PostData.files = [file.fileid]
                    } else {
                        PostData.files = []
                    }
                } else {
                    const idindex = PostData.files.indexOf(file.fileid)
                    if (state) {
                        if (idindex != -1) return
                        PostData.files.push(file.fileid)
                    } else {
                        if (idindex == -1) return
                        PostData.files.splice(idindex, 1)
                    }
                }
            })
        }
    }

    if (PostData.files.length != 0) getFiles(postType.element.value)

    const submitBtn = new Button('Submit', container.element, null, async () => {
        const postResult = await API('POST', '/api/posts', PostData, true)
        if (postResult.HTTPCODE == 200) {
            new Alert.SimpleAlert(`Post "${postResult.postID}" created!`, 'Success', 5000, null, postResult.postID)
            overlay.element.click()
            editedCB()
        }
    })
}