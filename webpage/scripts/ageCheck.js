import DropdownList from "../components/dropdownList/script.js";
import Elem from "../components/elem/script.js";
import Overlay from "../features/overlay/script.js";
import Language from "./language.js";
import User from "./userdata.js";

const isAgeCheckComplete = localStorage.getItem("ageCheck") === "complete"

if (!isAgeCheckComplete) {
    const overlay = new Overlay(false)

    const block = new Elem("age-check-cont", overlay.element)

    new Elem("age-check-label", block.element).text = Language.lang.features.ageCheck.hello
    new Elem("text", block.element).text = Language.lang.features.ageCheck.text

    new DropdownList([
        {
            name: Language.lang.features.ageCheck.options[0],
            value: "N18"
        },
        {
            name: Language.lang.features.ageCheck.options[1],
            value: "Y18H"
        },
        {
            name: Language.lang.features.ageCheck.options[2],
            value: "Y18B"
        },
        {
            name: Language.lang.features.ageCheck.options[3],
            value: "Y18S"
        }
    ], block.element, Language.lang.features.ageCheck.ddLabel, (v) => {
        localStorage.setItem("ageCheck", "complete")

        switch (v) {
            case "N18": {
                User.Settings.set("contentFiler", {
                    safe: { show: true, blur: false },
                    questionable: { show: true, blur: true },
                    explicit: { show: false, blur: true }
                })
            }; break;
            case "Y18H": {
                User.Settings.set("contentFiler", {
                    safe: { show: true, blur: false },
                    questionable: { show: true, blur: false },
                    explicit: { show: false, blur: true }
                })
            }; break;
            case "Y18B": {
                User.Settings.set("contentFiler", {
                    safe: { show: true, blur: false },
                    questionable: { show: true, blur: false },
                    explicit: { show: true, blur: true }
                })

                location.reload()
            }; break;
            case "Y18S": {
                User.Settings.set("contentFiler", {
                    safe: { show: true, blur: false },
                    questionable: { show: true, blur: false },
                    explicit: { show: true, blur: false }
                })

                location.reload()
            }; break;
        }

        overlay.close()
    })
}
