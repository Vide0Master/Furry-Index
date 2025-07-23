import Button from "../../components/button/script.js";
import Elem from "../../components/elem/script.js";
import Icon from "../../components/icon/script.js";
import Image from "../../components/image/script.js";
import Link from "../../components/link/script.js";
import Video from "../../components/video/script.js";
import Alert from "../../features/alert/script.js";
import API from "../../scripts/api.js";
import formatDate from "../../scripts/formatDate.js";
import formatFileSize from "../../scripts/formatFileSize.js";
import getFileHash from "../../scripts/getFileHash.js";
import Tag from "../tag/script.js";
import TextLabel from "../textLabel/script.js";
import Language from "../../scripts/language.js";
import Countdown from "../countdown/script.js";
import User from "../../scripts/userdata.js";
import UserLabel from "../userLabel/script.js";

export default class FileCard extends Elem {
    constructor(file, isUploadable, parent, options = { remove: true }) {
        super('file-card', parent)

        if (isUploadable) {
            this.filename = new Elem('file-name', this.element)
            this.filename.element.innerText = file.name
            this.filename.element.title = Language.lang.elements.fileCard.fnameNotBeSaved
            this.fileContainer = new Elem('file-container', this.element)

            switch (true) {
                case file.type.startsWith('image'): {
                    this.image = new Image(URL.createObjectURL(file), 'file image', this.fileContainer.element)
                }; break;
                case file.type.startsWith('video'): {
                    this.video = new Video(URL.createObjectURL(file), this.fileContainer.element, { muted: true, loop: true })
                }; break;
            }

            this.filesize = new Elem('file-size', this.element)
            this.filesize.element.innerText = `${Language.lang.elements.fileCard.fsize}: ` + formatFileSize(file.size)
            const segments = Math.ceil(file.size / (1024 * 1024))
            this.filesize.element.title = `${file.size} Bytes\n${segments} Segments`

            this.filetype = new Elem('file-type', this.element)
            this.filetype.element.innerText = `${Language.lang.elements.fileCard.ftype}: ` + file.type

            this.uploadFile = async () => {
                this.uploadButton.element.remove()

                const fileHash = await getFileHash(file)

                const requestAdress = `/api/upload?hash=${fileHash}&filetype=${file.type.split('/')[1]}&segments=${segments}`

                const serverInfo = await API('GET', requestAdress)
                switch (serverInfo.HTTPCODE) {
                    case 200: {
                        console.log(`New upload started, got handshake [${serverInfo.handle}]`)
                    }; break;
                    case 300: {
                        console.log(`Old upload resumed, got handshake [${serverInfo.handle}]`)
                    }; break;
                }

                const uploadSegmentsContainer = new Elem('upload-segments-container', this.fileContainer.element)

                async function sendSegment(segmentData, elem) {
                    const segmentResult = await API('POST', '/api/upload', segmentData, true)
                    switch (segmentResult.HTTPCODE) {
                        case 202: {
                            elem.classList.add('ok')
                        }; break;
                        case 200: {
                            elem.classList.add('ok')

                            while (uploadSegmentsContainer.element.firstChild) {
                                uploadSegmentsContainer.element.removeChild(uploadSegmentsContainer.element.firstChild);
                            }

                            uploadSegmentsContainer.element.classList.add('processing')

                            const fileProcessing = await API('GET', `${requestAdress}&process=start`, null, true)

                            new TextLabel('Stats set', uploadSegmentsContainer.element, 'green', true)

                            if (fileProcessing.convertedFromGif) new TextLabel('GIF ❯ MP4', uploadSegmentsContainer.element, 'green', true)
                            if (fileProcessing.videoReencoded) new TextLabel('VID ❯ H264', uploadSegmentsContainer.element, 'green', true)
                            if (fileProcessing.audioReencoded) new TextLabel('AUD ❯ AAC', uploadSegmentsContainer.element, 'green', true)

                            uploadSegmentsContainer.element.classList.remove('processing')

                            if (fileProcessing.HTTPCODE == 200) {
                                uploadSegmentsContainer.element.classList.add('complete')
                            } else {
                                uploadSegmentsContainer.element.classList.add('err')
                            }
                        }; break;
                        default: {
                            elem.classList.add('err')
                            uploadSegmentsContainer.element.classList.add('error')
                        }; break;
                    }
                }

                for (let i = 0; i < segments; i++) {
                    const uploadSegment = new Elem('upload-segment', uploadSegmentsContainer.element)
                    uploadSegment.element.title = (i != segments - 1) ? `${Language.lang.elements.fileCard.segment[0]}: ${i + 1}\n${Language.lang.elements.fileCard.segment[1]}: ${formatFileSize(1024 * 1024)}` : `${Language.lang.elements.fileCard.segment[0]}: ${i + 1}\n${Language.lang.elements.fileCard.segment[1]}: ${formatFileSize(file.size - (1024 * 1024 * i))}`

                    const start = i * (1024 * 1024);
                    const end = Math.min(file.size, start + (1024 * 1024));
                    const segment = file.slice(start, end);

                    const formdata = new FormData()
                    formdata.append('segment', segment);
                    formdata.append('segmentID', i);
                    formdata.append('handle', serverInfo.handle)

                    sendSegment(formdata, uploadSegment.element)
                }
            }

            this.uploadButton = new Button('Upload', this.element, null, this.uploadFile)
        } else {
            this.fileid = new Elem('file-id', this.element)
            this.fileid.text = file.id

            this.fileContainer = new Elem('file-container', this.element)

            this.image = new Image(`/file/${file.id}?thumbnail=150`, 'file image', this.fileContainer.element)

            this.uploaded = new Elem('uploaded-on', this.element)
            new Icon('upload', this.uploaded.element)
            new Elem('uploaded-on-text', this.uploaded.element).text = formatDate(file.createdAt)

            if (file.eraseOn) {
                this.eraseOn = new Elem('erase-on', this.element)
                new Icon('delete-file', this.eraseOn.element)
                this.eraseOnCntdown = new Countdown(file.eraseOn, this.eraseOn.element, file.updatedAt)
            }

            const tagsList = new Elem('tags-list', this.element)

            for (const tag of file.tags) {
                new Tag(tag, tagsList.element)
            }

            this.txtLbl = {}

            const makeInfoLbl = () => {
                if (file.post || file.avatarfor) {
                    this.txtLbl = new TextLabel(null, this.element, 'green', true)
                    new Elem(null, this.txtLbl.element).text = `${Language.lang.elements.fileCard.linked.label}`

                    if (file.post) {
                        new Link(Language.lang.elements.fileCard.linked.to.post, `/post/${file.post.id}`, this.txtLbl.element, true)
                    }

                    if (file.avatarfor) {
                        new Link(Language.lang.elements.fileCard.linked.to.pfavatar, `/profile/${file.avatarfor.username}`, this.txtLbl.element, true)
                    }
                }
            }

            makeInfoLbl()

            if (file.fileparams.width == file.fileparams.height && !file.avatarfor && !file.post) {
                this.setAvatarBtn = new Button(Language.lang.elements.fileCard.useAsAvatar, this.element, null, async () => {
                    const avatarSetResult = await API('PUT', `/api/profile/${User.data.username}`, { avatarID: file.id })
                    if (avatarSetResult.HTTPCODE == 200) {
                        await User.updateUserData()
                        UserLabel.checkUserData()
                        this.setAvatarBtn.kill()
                        this.eraseOn.kill()
                        this.eraseOnCntdown.kill()
                        this.removeButton.kill()
                        
                        file.avatarfor = { username: User.data.username }
                        makeInfoLbl()
                    }
                })
            }

            if (options.remove && !file.post && !file.avatarfor) {
                this.delete = async (e) => {
                    this.removeButton.switchVisible(false)
                    const removeResult = await API('DELETE', `/file/${file.id}${e.shiftKey ? "&force=true" : ""}`, null, true)

                    if (removeResult.HTTPCODE == 200) {
                        new Alert.Simple(`ID: ${file.id}`, Language.lang.elements.fileCard.delete.alert, 5000, null, file.id)
                        this.element.remove()
                    }
                }

                this.removeButton = new Button(Language.lang.elements.fileCard.delete.buttonLabel, this.element, null, () => {
                    new Alert.Confirm(`${Language.lang.elements.fileCard.delete.confirmText[0]} ${file.id}${Language.lang.elements.fileCard.delete.confirmText[1]}`, Language.lang.elements.fileCard.delete.confirm, () => { this.delete() })
                })
            }
        }
    }
}