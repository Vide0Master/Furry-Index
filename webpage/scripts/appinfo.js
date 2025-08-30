import Elem from "../components/elem/script.js";
import Footer from "../components/footer/script.js";
import API from "./api.js";
import Language from "./language.js";

export default class AppInfo {
    static appData = {}

    static async getAppInfo() {
        const appinf = await API('GET', '/api/whatisthisbuild')
        delete appinf.HTTPCODE
        delete appinf.TEXT
        this.appData = appinf

        if (this.appData.isDev) {
            console.log(`%c${Language.lang.cmd.dev}`, `color: greenyellow`);
        } else if (this.appData.isEval) {
            console.log(`%c${Language.lang.cmd.eval}`, `color: orange`);
        } else {
            console.log(`%c${Language.lang.cmd.warn}`, `color: red`);
        }

        createDevInfoBanner(this.appData)
    }
}

function createDevInfoBanner(appinfo) {
    const devBuildInfo = new Elem('build-info', Footer.element)
    let txt = ''
    switch (true) {
        case appinfo.isDev: {
            txt = "DEV"
        }; break;
        case appinfo.isEval: {
            txt = "EVAL"
        }; break;
        default: {
            txt = "REL"
        }; break;
    }

    devBuildInfo.element.classList.add(txt)

    new Elem('main-text', devBuildInfo.element).text = 'Running Furry-Index engine'
    new Elem('version', devBuildInfo.element).text = txt + ' v' + appinfo.version

    devBuildInfo.title = Language.lang.BUILD[txt.toLocaleLowerCase()]
}
