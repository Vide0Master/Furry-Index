import processText from "../../scripts/bigTextProcessor.js";
import Elem from "../../components/elem/script.js";
import Language from "../../scripts/language.js";
import Link from "../../components/link/script.js";

export const tag = "info";
export const tagLimit = 1;

export async function render(params) {
    const container = new Elem("info-page-container")

    switch (params.specific) {
        case "terms-of-service": {
            processText(Language.lang.TOS, container)
        }; break;
        case "privacy-policy": {
            processText(Language.lang.PP, container)
        }; break;
        case "content-guidelines": {
            processText(Language.lang.CG, container)
        }; break;
        case "behaviuor-gudelines": {
            processText(Language.lang.BG, container)
        }; break;
        default: {
            new Link(Language.lang.header.legal.tos, "/info/terms-of-service", container, true)
            new Link(Language.lang.header.legal.pp, "/info/privacy-policy", container, true)
            new Link(Language.lang.header.legal.cg, "/info/content-guidelines", container, true)
            new Link(Language.lang.header.legal.bg, "/info/behaviuor-gudelines", container, true)
        }; break;
    }

    return container.element;
}
