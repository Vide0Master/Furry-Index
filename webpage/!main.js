import Footer from "./components/footer/script.js"
import Header from "./components/header/script.js"
import Main from "./components/main/script.js"
import AppInfo from "./scripts/appinfo.js"
import Router from "./scripts/router.js"
import User from "./scripts/userdata.js"
import WSController from "./scripts/ws.js"

//on dom load
document.addEventListener('DOMContentLoaded', async () => {
    await AppInfo.getAppInfo()
    await User.updateUserData()
    Header.render()
    Main.render()
    Footer.render()
    Router.init()
})