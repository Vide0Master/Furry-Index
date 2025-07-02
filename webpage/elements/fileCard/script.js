import Button from "../../components/button/script.js";
import Elem from "../../components/elem/script.js";
import Icon from "../../components/icon/script.js";
import Image from "../../components/image/script.js";
import Video from "../../components/video/script.js";
import Alert from "../../features/alert/script.js";
import API from "../../scripts/api.js";
import formatDate from "../../scripts/formatDate.js";
import formatFileSize from "../../scripts/formatFileSize.js";
import getFileHash from "../../scripts/getFileHash.js";
import Tag from "../tag/script.js";
import TextLabel from "../textLabel/script.js";

export default class FileCard {
    constructor(file, isUploadable, parent, options = { remove: true }) {
        this.element = new Elem('file-card', parent)

        if (isUploadable) {
            this.filename = new Elem('file-name', this.element.element)
            this.filename.element.innerText = file.name
            this.filename.element.title = "Filename will not be saved on server"
            this.fileContainer = new Elem('file-container', this.element.element)

            switch (true) {
                case file.type.startsWith('image'): {
                    this.image = new Image(URL.createObjectURL(file), 'file image', this.fileContainer.element)
                }; break;
                case file.type.startsWith('video'): {
                    this.video = new Video(URL.createObjectURL(file), this.fileContainer.element, { muted: true, loop: true })
                }; break;
            }

            this.filesize = new Elem('file-size', this.element.element)
            this.filesize.element.innerText = 'Filesize: ' + formatFileSize(file.size)
            const segments = Math.ceil(file.size / (1024 * 1024))
            this.filesize.element.title = `${file.size} Bytes\n${segments} Segments`

            this.filetype = new Elem('file-type', this.element.element)
            this.filetype.element.innerText = 'Filetype: ' + file.type

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
                    uploadSegment.element.title = (i != segments - 1) ? `Segment: ${i + 1}\nWeight: ${formatFileSize(1024 * 1024)}` : `Segment: ${i + 1}\nWeight: ${formatFileSize(file.size - (1024 * 1024 * i))}`

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

            this.uploadButton = new Button('Upload', this.element.element, null, this.uploadFile)
        } else {
            this.fileid = new Elem('file-id', this.element.element)
            this.fileid.text = file.fileid

            this.fileContainer = new Elem('file-container', this.element.element)

            this.image = new Image(`/file/${file.fileid}?thumbnail=150`, 'file image', this.fileContainer.element)

            this.uploaded = new Elem('uploaded-on', this.element.element)

            new Icon('upload', this.uploaded.element)

            new Elem('uploaded-on-text', this.uploaded.element).text = formatDate(file.createdAt)

            const tagsList = new Elem('tags-list', this.element.element)

            for (const tag of file.tags) {
                new Tag(tag, tagsList.element)
            }

            if (options.remove && file.post.length == 0) {
                this.delete = async (e) => {
                    const removeResult = await API('DELETE', `/file/${file.fileid}${e.shiftKey ? "&force=true" : ""}`, null, true)

                    if (removeResult.HTTPCODE == 200) {
                        new Alert.SimpleAlert(`ID: ${file.fileid}`, 'Removed file', 5000, null, file.fileid)
                        this.element.element.remove()
                    }
                }

                this.removeButton = new Button('Remove file', this.element.element, null, this.delete)
            }
        }
    }
}