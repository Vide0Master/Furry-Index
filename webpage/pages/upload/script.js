
import Button from "../../components/button/script.js";
import Elem from "../../components/elem/script.js";
import UploadField from "../../components/uploadfield/script.js";
import FileCard from "../../elements/fileCard/script.js";
import Language from "../../scripts/language.js";

export const tag = "upload";
export const tagLimit = 1;

export async function render(params) {
    const container = new Elem('upload-container')

    const upload = new UploadField(container.element)

    const fileManagerField = new Elem('file-manager', container.element)

    let fileList = []

    const groupUploadBtn = new Button(Language.lang.upload.groupUpload, container.element, 'hidden', async () => {
        for (const fCard of fileList) {
            fCard.uploadFile()
        }
        groupUploadBtn.switchVisible(false)
    })

    groupUploadBtn.switchVisible(false)

    upload.onFileChange((files) => {
        fileList = []
        fileManagerField.element.innerHTML = ''

        groupUploadBtn.switchVisible(files.length > 1)

        for (const file of files) {
            fileList.push(new FileCard(file, true, fileManagerField.element))
        }
    })

    return container.element;
}
