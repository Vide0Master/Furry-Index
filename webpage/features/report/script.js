import BigTextField from "../../components/bigtextfield/script.js"
import Button from "../../components/button/script.js"
import DropdownList from "../../components/dropdownList/script.js"
import Elem from "../../components/elem/script.js"
import TextLabel from "../../elements/textLabel/script.js"
import API from "../../scripts/api.js"
import Language from "../../scripts/language.js"
import Alert from "../alert/script.js"
import Overlay from "../overlay/script.js"

const reportTypes = {
    spam: {
        pageData: "req",
        description: "opt"
    },
    advertisement: {
        pageData: "req",
        description: "opt"
    },
    cp: {
        pageData: "req",
        description: "opt"
    },
    inappropriateContent: {
        pageData: "req",
        description: "req"
    },
    inappropriateBehaviour: {
        pageData: "req",
        description: "req"
    },
    scam: {
        pageData: "req",
        description: "req"
    },
    fraud: {
        pageData: "req",
        description: "req"
    },
    bug: {
        redirect: "https://github.com/Vide0Master/Furry-Index/issues",
        suffix: " (GitHub)"
    },
    featureRequest: {
        redirect: "https://github.com/Vide0Master/Furry-Index/issues",
        suffix: " (GitHub)"
    }
}

export default class ReportOverlay {
    constructor(options = {}) {
        const overlay = new Overlay(true)

        const reportCont = new Elem("internal-report-cont", overlay)

        new Elem("label", reportCont).text = Language.lang.features.report.label

        const optionsList = []
        for (const opt in reportTypes) {
            if (options?.inc?.includes(opt) || (options?.exc && !options?.exc?.includes(opt)))
                optionsList.push({ name: Language.lang.features.report.types[opt] + (reportTypes[opt]?.suffix || ""), value: opt })
        }

        const description = new BigTextField(Language.lang.features.report.desc, reportCont, null, (v) => {
            if (v.length > 0) submitBtn.enabled = true
        })

        const pageDataReq = new TextLabel(Language.lang.features.report.pageDataInc, reportCont, "var(--ok-color)")

        const submitBtn = new Button(Language.lang.features.report.submit, reportCont, null, async () => {
            const reportResult = await API("post", "/api/reports", { type: selectorList.value, description: description.value, data: options.data })
            if (reportResult.HTTPCODE === 200) {
                overlay.close()
                new Alert.Simple(Language.lang.features.report.succ, null, 5000, null, "reportSendSucc")
            }
        })

        const selectorList = new DropdownList(optionsList, reportCont, Language.lang.features.report.types.label, v => {
            const currentType = reportTypes[v]

            submitBtn.enabled = true

            if (["req", "opt"].includes(currentType.description)) {
                description.enabled = true
                description.value = ""
                if (currentType.description === "req") {
                    description.label.text = `${Language.lang.features.report.desc} (${Language.lang.features.report.descLbl.req})`
                    submitBtn.enabled = false
                } else {
                    description.label.text = `${Language.lang.features.report.desc} (${Language.lang.features.report.descLbl.opt})`
                }
            }
            pageDataReq.switchVisible(currentType.pageData === "req")

            if (currentType.description === "hide") description.switchVisible(false)

            if (currentType.redirect) {
                overlay.close()
                window.open(currentType.redirect, "_blank");
            }
        }, Language.lang.features.report.types.selLabel + ": ")
        selectorList.moveBefore(description)

        submitBtn.enabled = false
        description.enabled = false
        pageDataReq.switchVisible(false)
    }
}