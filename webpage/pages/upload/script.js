
import Button from "../../components/button/script.js";
import Elem from "../../components/elem/script.js";
import UploadField from "../../components/uploadfield/script.js";
import FileCard from "../../elements/fileCard/script.js";
import Language from "../../scripts/language.js";

export const tag = "upload";
export const tagLimit = 1;
export const titleID = tag

export async function render() {
    const container = new Elem("upload-container")

    const upload = new UploadField(container.element)

    const fileManagerField = new Elem("file-manager", container.element)

    let fileList = []

    const groupUploadBtn = new Button("", container.element, "hidden", async () => {
        for (const fCard of fileList) {
            fCard.uploadFile()
        }
        groupUploadBtn.switchVisible(false)
    })

    groupUploadBtn.switchVisible(false)

    upload.onFileChange((files) => {
        fileList = []
        fileManagerField.element.innerHTML = ""

        if (files.length > 1) {
            groupUploadBtn.text = Language.lang.upload.group
        } else {
            groupUploadBtn.text = Language.lang.upload.single
        }

        groupUploadBtn.switchVisible(true)

        for (const file of files) {
            fileList.push(new FileCard(file, true, fileManagerField.element, { onUpload: () => { groupUploadBtn.switchVisible(false) } }))
        }
    })

    return container.element;
}
