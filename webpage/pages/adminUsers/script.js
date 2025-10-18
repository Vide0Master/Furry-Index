import Elem from "../../components/elem/script.js";
import User from "../../scripts/userdata.js";
import Language from "../../scripts/language.js";

export const tag = "adminusers";
export const tagLimit = 1;

export async function render() {
    const container = new Elem("template-container")

    if (!User.testUserPermission("admin:users")) {
        container.text = Language.lang.SYSTEM.navitaion.noAccess
        return container.element
    }

    return container.element;
}
