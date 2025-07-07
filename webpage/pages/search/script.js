import Elem from "../../components/elem/script.js";
import PostCard from "../../elements/postCard/script.js";
import API from "../../scripts/api.js";
import Language from "../../scripts/language.js";

export const tag = "search";
export const tagLimit = 1;

export async function render(params) {
    const container = new Elem('search-container')

    return container.element;
}
