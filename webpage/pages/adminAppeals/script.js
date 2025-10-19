import Elem from "../../components/elem/script.js";
import Language from "../../scripts/language.js";
import User from "../../scripts/userdata.js";

export const tag = "adminappeals";
export const tagLimit = 1;

export async function render() {
    const container = new Elem("template-container")

    if (!User.testUserPermission("admin:appeals")) {
        container.text = Language.lang.SYSTEM.navitaion.noAccess
        return container.element
    }

    return container.element;
}