import Elem from "../../components/elem/script.js";

export const tag = "settings";
export const tagLimit = 1;

export async function render(params) {
    const container = new Elem('settings-container')
    container.element.innerText = 'settings'
    return container.element;
}
