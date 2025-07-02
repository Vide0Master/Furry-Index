import Elem from "../../components/elem/script.js";
import Image from "../../components/image/script.js";
import FileCard from "../../elements/fileCard/script.js";
import API from "../../scripts/api.js";
import Language from "../../scripts/language.js";

export const tag = "file-manager";
export const tagLimit = 1;

export async function render(params) {
    const container = new Elem('file-manager-container')

    const searchBar = new Elem('search-bar', container.element)

    const fileField = new Elem('files-container', container.element)
    const userFiles = await API('GET', '/api/file-manager', null, true)

    if (userFiles.files.length == 0) {
        new Elem('label', fileField.element).text = Language.lang.fileManager.noFilesLabel
    } else {
        for (const file of userFiles.files) {
            new FileCard(file, false, fileField.element)
        }
    }

    return container.element;
}
