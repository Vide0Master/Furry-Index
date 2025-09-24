import Elem from "../../components/elem/script.js";

export const tag = "adminposts";
export const tagLimit = 1;

export async function render() {
    const container = new Elem("template-container")

    return container.element;
}
