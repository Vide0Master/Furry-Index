import Elem from "../components/elem/script.js";
import Footer from "../components/footer/script.js";
import API from "./api.js";
import Language from "./language.js";

export default class AppInfo {
    static appData = {}

    static async getAppInfo() {
        const appinf = await API('GET', '/api/whatisthisbuild')
        delete appinf.HTTPCODE
        this.appData = appinf

        if (this.appData.isDev) {
            console.log(`%c${Language.lang.cmd.dev}`, `color: greenyellow`);
            createDevInfoBanner(this.appData)
        } else if (this.appData.isEval) {
            console.log(`%c${Language.lang.cmd.eval}`, `color: orange`);
            createDevInfoBanner(this.appData)
        } else {
            console.log(`%c${Language.lang.cmd.warn}`, `color: red`);
        }
    }
}

function createDevInfoBanner(appinfo) {
    const devBuildInfo = new Elem('dev-build-info', Footer.element)
    new Elem('version', devBuildInfo.element).text = 'V: ' + appinfo.version
    const text = new Elem('text', devBuildInfo.element)
    switch (true) {
        case appinfo.isDev: {
            text.text = 'DEVELOPMENT BUILD'
        }; break;
        case appinfo.isEval: {
            text.text = 'EVALUATION BUILD'
        }; break;
    }
    new Elem('text', devBuildInfo.element).text = 'SEPARATE DATABASE PROVIDED'
}