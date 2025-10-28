import Elem from "../../components/elem/script.js";
import Language from "../../scripts/language.js";
import User from "../../scripts/userdata.js";
import PageNavigator from "../../elements/pagenavigator/script.js";
import API from "../../scripts/api.js";
import ReportCard from "../../elements/reportCard/script.js";

export const tag = "adminreports";
export const tagLimit = 1;
export const titleID = "adminReports"

const reportsOnPage = 20

export async function render() {
    const container = new Elem("admin-reports-container")

    if (!User.testUserPermission("admin:reports")) {
        container.text = Language.lang.SYSTEM.navigation.noAccess
        return container.element
    }

    const reportsList = new Elem("reports-container", container.element)

    async function getReportsCount() {
        const count = await API("GET", `/api/reports?count=1`)
        return count.count
    }

    const pageNav = new PageNavigator(Math.ceil((await getReportsCount()) / reportsOnPage), 1, container.element, true)

    async function updateReportsList(p) {
        reportsList.wipe()
        const reportsResp = await API("GET", `/api/reports?p=${p - 1}&t=${reportsOnPage}`)

        for (const report of reportsResp.reports) {
            new ReportCard(reportsList, report)
        }
    }

    updateReportsList(1)

    pageNav.addNavCB(async p => {
        updateReportsList(p)
        pageNav.renderButtons(Math.ceil((await getReportsCount()) / reportsOnPage), p)
    })

    return container.element;
}