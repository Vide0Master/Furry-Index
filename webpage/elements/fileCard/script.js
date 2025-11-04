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
import downloadFile from "../../scripts/downloadFile.js";

export default class FileCard extends Elem {
    constructor(file, isUploadable, parent, options = { remove: true, avatar: true, onUpload: () => { }, download: false }) {
        super("file-card", parent)

        this.fileContainer = new Elem("file-container", this)

        this.fileData = new Elem("file-data", this)

        const makePreview = (type, link) => {
            switch (type) {
                case "image": {
                    this.image = new Image(link, "file image", this.fileContainer)
                }; break;
                case "video": {
                    this.video = new Video(link, this.fileContainer, { muted: true, loop: true })
                }; break;
            }
        }

        if (isUploadable) {
            makePreview(file.type.startsWith("image") ? "image" : "video", URL.createObjectURL(file))
        } else {
            makePreview("image", `/file/${file.id}?thumbnail=150`)
        }

        // this.filename = new Elem("file-name", this.fileData)
        // this.filename.text = isUploadable ? file.name : file.id
        // if (isUploadable) {
        //     this.filename.element.title = Language.lang.elements.fileCard.fnameNotBeSaved
        // }

        this.filesize = new Elem("file-size", this.fileData)
        this.filesize.text = `${Language.lang.elements.fileCard.fsize}: ` + formatFileSize(file?.size ? file?.size : file?.fileparams?.size)

        this.filetype = new Elem("file-type", this.fileData)
        this.filetype.text = `${Language.lang.elements.fileCard.fformat}: ${file?.type ? file?.type.split("/")[1] : file?.filetype}`

        if (isUploadable) {
            const segments = Math.ceil(file.size / (1024 * 1024))
            this.filesize.title = `${file.size} ${Language.lang.elements.fileCard.bytes}\n${segments} ${Language.lang.elements.fileCard.segments}`

            this.uploadFile = async () => {
                options.onUpload()

                const fileHash = await getFileHash(file)
                const requestAdress = `/api/upload?hash=${fileHash}&filetype=${file.type.split("/")[1]}&segments=${segments}`
                const serverInfo = await API("GET", requestAdress)

                let uploadedSegments = []
                switch (serverInfo.HTTPCODE) {
                    case 200:
                        console.log(`New upload started, got handshake [${serverInfo.handle}]`)
                        break
                    case 300:
                        console.log(`Old upload resumed, got handshake [${serverInfo.handle}]`)
                        uploadedSegments = serverInfo.uploadedSegments || []
                        break
                }

                const uploadSegmentsContainer = new Elem("upload-segments-container", this.fileContainer.element)

                async function sendSegment(segmentData, elem) {
                    const segmentResult = await API("POST", "/api/upload", segmentData, true)
                    switch (segmentResult.HTTPCODE) {
                        case 202:
                            elem.classList.add("ok")
                            break
                        case 200:
                            {
                                elem.classList.add("ok")
                                while (uploadSegmentsContainer.element.firstChild) {
                                    uploadSegmentsContainer.element.removeChild(uploadSegmentsContainer.element.firstChild);
                                }
                                uploadSegmentsContainer.element.classList.add("processing")
                                const fileProcessing = await API("GET", `${requestAdress}&process=start`, null, true)
                                new TextLabel(Language.lang.elements.fileCard.complete, uploadSegmentsContainer.element, "green", true)
                                if (fileProcessing.convertedFromGif) new TextLabel("GIF ❯ MP4", uploadSegmentsContainer.element, "green", true)
                                if (fileProcessing.videoReencoded) new TextLabel("VID ❯ H264", uploadSegmentsContainer.element, "green", true)
                                if (fileProcessing.audioReencoded) new TextLabel("AUD ❯ AAC", uploadSegmentsContainer.element, "green", true)
                                uploadSegmentsContainer.element.classList.remove("processing")
                                if (fileProcessing.HTTPCODE == 200) {
                                    uploadSegmentsContainer.element.classList.add("complete")
                                } else {
                                    uploadSegmentsContainer.element.classList.add("err")
                                }
                                break
                            }
                        default:
                            elem.classList.add("err")
                            uploadSegmentsContainer.element.classList.add("error")
                            break
                    }
                }

                const segmentBlocks = [];
                for (let i = 0; i < segments; i++) {
                    const uploadSegment = new Elem("upload-segment", uploadSegmentsContainer.element);
                    uploadSegment.element.title = `Сегмент ${i + 1}`;

                    if (uploadedSegments.includes(i)) {
                        uploadSegment.element.classList.add("ok");
                    }

                    segmentBlocks.push(uploadSegment);
                }

                async function uploadSegmentsSequentially() {
                    for (let i = 0; i < segments; i++) {
                        if (uploadedSegments.includes(i)) continue;

                        const start = i * (1024 * 1024);
                        const end = Math.min(file.size, start + (1024 * 1024));
                        const segment = file.slice(start, end);

                        const formdata = new FormData();
                        formdata.append("segment", segment);
                        formdata.append("segmentID", i);
                        formdata.append("handle", serverInfo.handle);

                        await sendSegment(formdata, segmentBlocks[i].element, i);
                    }
                }

                uploadSegmentsSequentially();
            }
        } else {
            // this.uploaded = new Elem("uploaded-on", this.fileData)
            // new Icon("upload", this.uploaded.element)
            // new Elem("uploaded-on-text", this.uploaded.element).text = formatDate(file.createdAt)

            if (file.eraseOn) {
                this.eraseOn = new Elem("erase-on", this.fileData)
                new Icon("delete-file", this.eraseOn.element)
                this.eraseOnCntdown = new Countdown(file.eraseOn, this.eraseOn.element, file.updatedAt)
            }

            const tagsList = new Elem("tags-list", this.fileData)

            file.tags = file.tags.sort((a, b) => a.name.length - b.name.length)

            for (const tag of file.tags) {
                new Tag(tag, tagsList)
            }

            if (file.post || file.avatarfor) {
                this.txtLbl = new TextLabel(null, this, "green", true)
                this.txtLbl.addClass("low-label")
                new Elem(null, this.txtLbl.element).text = `${Language.lang.elements.fileCard.linked.label}`

                if (file.post) {
                    new Link(Language.lang.elements.fileCard.linked.to.post, `/post/${file.post.id}`, this.txtLbl.element, true)
                }

                if (file.avatarfor) {
                    new Link(Language.lang.elements.fileCard.linked.to.pfavatar, `/profile/${file.avatarfor.username}`, this.txtLbl.element, true)
                }
            }

            if (file.fileparams.width == file.fileparams.height && !file.avatarfor && !file.post && !User.data?.avatar?.file && options.avatar) {
                this.setAvatarBtn = new Button(Language.lang.elements.fileCard.useAsAvatar, this.fileData, null, async () => {
                    const avatarSetResult = await API("PUT", `/api/profile/${User.data.username}`, { avatarID: file.id })
                    if (avatarSetResult.HTTPCODE == 200) {
                        await User.updateUserData()
                        UserLabel.checkUserData()
                        location.reload()
                    }
                })
            }

            if (options.download) {
                new Button(Language.lang.postView.download, this.fileData, null, async () => {
                    await downloadFile(`/file/${file.id}`,
                        "Furry Index " + file.id
                    )
                })
            }

            if (options?.remove && !file.post && !file.avatarfor) {
                this.delete = async (e) => {
                    this.removeButton.switchVisible(false)
                    const removeResult = await API("DELETE", `/file/${file.id}${e?.shiftKey ? "?force=true" : ""}`, null, true)

                    if (removeResult.HTTPCODE == 200) {
                        new Alert.Simple(`ID: ${file.id}`, Language.lang.elements.fileCard.delete.alert, 5000, null, file.id)
                        this.element.remove()
                    }

                    if (options.onRM) options.onRM()
                }

                this.removeButton = new Button(Language.lang.elements.fileCard.delete.buttonLabel, this.fileData, null, (e) => {
                    if (e.shiftKey) {
                        this.delete(e)
                        return
                    }
                    new Alert.Confirm(`${Language.lang.elements.fileCard.delete.confirmText[0]} ${file.id}${Language.lang.elements.fileCard.delete.confirmText[1]}`, Language.lang.elements.fileCard.delete.confirm, (e) => { this.delete(e) })
                })
            }
        }

        const drawerBtn = new Elem("drawer-btn", this.fileData)
        new Elem("arrow", drawerBtn).text = "▼"
        drawerBtn.addEvent("click", () => {
            this.fileData.e.classList.toggle("open")
        })

        document.addEventListener("click", (e) => {
            if (!this.fileData.element.contains(e.target)) {
                this.fileData.rmClass("open")
            }
        })
    }
}