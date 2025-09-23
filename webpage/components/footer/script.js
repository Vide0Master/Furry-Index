import VMTechLogo from "../../elements/VMTechLogo/script.js"
import Elem from "../elem/script.js"
import Image from "../image/script.js"
import Link from "../link/script.js"
import Language from "../../scripts/language.js"
import Overlay from "../../features/overlay/script.js"
import processText from "../../scripts/bigTextProcessor.js";
import TextInputLine from "../textinputline/script.js"
import Button from "../button/script.js"
import Alert from "../../features/alert/script.js"
import API from "../../scripts/api.js"

export default class Footer {
    static element = document.createElement("footer")

    static render() {
        document.querySelector("body").appendChild(this.element)
    }
}

new VMTechLogo(Footer.element)

const githubLink = new Link(null, "https://github.com/Vide0Master/Furry-Index", Footer.element, false, "github-link")
githubLink.textElem.element.remove()
new Image("/icons/github-mark.svg", "github-icon", githubLink.element)
new Elem("gthb-link-text", githubLink.element).text = "GitHub"

const policyes = new Elem("policies-cont", Footer.element)
new Link(Language.lang.register.TOS, () => {
    const overlay = new Overlay()
    processText(Language.lang.TOS, overlay.element)
}, policyes.element, false, null, "file")
new Link(Language.lang.register.PP, () => {
    const overlay = new Overlay()
    processText(Language.lang.PP, overlay.element)
}, policyes.element, false, null, "file")

new Link(Language.lang.keyRedeem.label, () => {
    const overlay = new Overlay()
    const redeemWindow = new Elem("key-redeem-window", overlay.element)
    new Elem("label", redeemWindow.element).text = Language.lang.keyRedeem.label
    let keyData = null
    const keyField = new TextInputLine("XXXXXX-XXXXXX-XXXXXX-XXXXXX", redeemWindow.element, "redeem-field", null, async (val) => {
        keyData = val
    })
    keyField.addCheck(Language.lang.keyRedeem.malformedKey, (val) => {
        const regex = /^[A-Z0-9]{6}(?:-[A-Z0-9]{6}){3}$/;
        return regex.test(val)
    })
    new Button(Language.lang.keyRedeem.redeem, redeemWindow.element, null, async () => {
        if (keyData) {
            const result = await API("POST", `/api/key/${keyData}`)

            switch (result.HTTPCODE) {
            case 200: break;
            case 404: {
                new Alert.Simple(Language.lang.keyRedeem.err.notFound, "Error", 5000, null, "keynotfound")
            }; return
            case 405: {
                new Alert.Simple(Language.lang.keyRedeem.err.redeemed, "Error", 5000, null, "keywasredeemed")
            }; return
            }

            switch (result.key.type) {
            case "superadminassign": {
                new Alert.Simple(Language.lang.keyRedeem.succ.superadminassign, "Success", 5000, null, "superadminroleass")
            }; break;
            }

            overlay.kill()
        } else {
            new Alert.Simple(Language.lang.keyRedeem.err.fix, "Error", 5000, null, "redeemerror")
        }
    })
}, Footer.element, false, null, "key")
