import Alert from "../../features/alert/script.js";
import Language from "../../scripts/language.js";
import Elem from "../elem/script.js";
import Icon from "../icon/script.js";

export default class UploadField extends Elem  {
    constructor(parent, accept = ['.png', '.jpg', '.gif', '.mp4']) {
        super('upload-field', parent, 'div');

        this.input =new Elem(null, this.element, 'input').element;
        this.input.type = 'file';

        if (accept) this.input.accept = accept.join(', ')
        this.input.multiple = true;
        this.input.style.display = 'none';

        this.dropZone = document.createElement('div');
        this.dropZone.className = 'upload-drop-zone';

        new Elem('label', this.dropZone).text = `${Language.lang.components.upload.field}\n${accept.join(', ')}`

        new Icon('upload', this.dropZone, null, '30x30')

        this.element.appendChild(this.dropZone);
        this.element.appendChild(this.input);

        if (parent) {
            parent.appendChild(this.element);
        }

        this.dropZone.addEventListener('click', () => this.input.click());
        this.input.addEventListener('change', () => this.handleFiles(this.input.files));

        this.dropZone.addEventListener('dragover', e => {
            e.preventDefault();
            this.dropZone.classList.add('hover');
        });
        this.dropZone.addEventListener('dragleave', () => {
            this.dropZone.classList.remove('hover');
        });
        this.dropZone.addEventListener('drop', e => {
            e.preventDefault();
            this.dropZone.classList.remove('hover');
            this.handleFiles(e.dataTransfer.files);
        });

        this.fileChangeCallbacks = []

        this.onFileChange = (cb) => {
            this.fileChangeCallbacks.push(cb)
        }
    }

    handleFiles(files) {
        const validFiles = [];

        for (const file of files) {
            const type = file.type;
            const isImage = type.startsWith('image/');
            const isVideo = type.startsWith('video/');

            if (!isImage && !isVideo) {
                new Alert.Simple(`${Language.lang.components.upload.errors.file} "${file.name}" ${Language.lang.components.upload.errors.unsupportedType}: ${type}`)
                continue;
            }

            const sizeLimit = isImage ? 500 * 1024 * 1024 : 3 * 1024 * 1024 * 1024;
            if (file.size > sizeLimit) {
                const sizeMB = (file.size / 1024 / 1024).toFixed(1);
                const maxMB = isImage ? 500 : 3072;
                new Alert.Simple(`${Language.lang.components.upload.errors.file} "${file.name}" ${Language.lang.components.upload.errors.tooLarge}: ${sizeMB}MB (${Language.lang.components.upload.errors.maxSize} ${maxMB}MB)`);
                continue;
            }

            validFiles.push(file);
        }

        if (validFiles.length > 0) {
            for (const cb of this.fileChangeCallbacks) {
                cb(validFiles);
            }
        }
    }
}
