import Elem from "../../components/elem/script.js";

export const tag = "TEMPLATE";
export const tagLimit = 1;

export async function render() {
    const container = new Elem('template-container')

    return container.element;
}

// this is template page
// all pages should have:
// - some tag name for page
// - tag limit for count of preloaded pages (deprecated)
// - render function that has params argument (optional) and returns element as shown
// page folder should have script and style for this page specifically, and class of page element should be unique