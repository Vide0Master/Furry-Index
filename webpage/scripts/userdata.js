import Alert from "../features/alert/script.js"
import API from "./api.js"

// "doNotChangeThis" used to describe version of settings structure
// if it was heavily changed, change the "doNotChangeThis" to +1
const defaultSettings = {
    doNotChangeThis: 2,
    globalprofileparams: {
        avatarShape: "square"
    },
    privateprofileparams: {
        postsPerPage: 50,
        filesPerPage: 50,
        contentFiler: {
            safe: { show: true, blur: false },
            questionable: { show: true, blur: true },
            explicit: { show: false, blur: true }
        }
    }
}

class Settings {
    static getStorage = () => {
        return JSON.parse(localStorage.getItem("settings") || "{}")
    }

    static setStorage = async (data) => {
        localStorage.setItem("settings", JSON.stringify(data))

        if (User.data) {
            (async () => {
                const update = await API("PUT", `/api/profile/${User.data.username}`,
                    {
                        globalprofileparams: data.globalprofileparams,
                        privateprofileparams: data.privateprofileparams
                    })
                if (update.HTTPCODE !== 200) {
                    new Alert.Simple("Error", "Error while updating remote user settings", 5000, null, "remoteusersettingerror")
                }
            })()
        }
    }

    static get(name, type) {
        return this.getStorage()[{ p: "privateprofileparams", g: "globalprofileparams" }[type]][name]
    }

    static set(name, value, type) {
        const data = this.getStorage()
        data[{ p: "privateprofileparams", g: "globalprofileparams" }[type]][name] = value
        this.setStorage(data)
    }
}

class User {
    static data = null

    get settings() { return Settings.getStorage() }

    static Settings = Settings

    static async updateUserData() {
        const userRequestResult = await API("GET", "/api/auth", null, true)

        if (userRequestResult.HTTPCODE == 200) {
            delete userRequestResult.HTTPCODE
            this.data = userRequestResult

            const mergedSettings = defaultSettings
            if (this.data.globalprofileparams) {
                mergedSettings.globalprofileparams = this.data.globalprofileparams
            }
            if (this.data.privateprofileparams) {
                mergedSettings.privateprofileparams = this.data.privateprofileparams
            }
            this.Settings.setStorage(mergedSettings)

        } else {
            this.data = null
        }
    }

    static async unlogin(cb) {
        const unloginRslt = await API("DELETE", "/api/auth", {}, true)
        await this.updateUserData()
        cb(unloginRslt.HTTPCODE == 200)
    }

    static loggedIn() {
        return this.data != null
    }

    static testUserPermission(permission, strict = true) {
        // stupid ahh check
        if (!this.data) return false

        if (strict) {
            return this.data.permissionsList.includes(permission);
        } else {
            return this.data.permissionsList.some(p => p.includes(permission));
        }
    }
}

if (Settings.getStorage()?.doNotChangeThis !== defaultSettings.doNotChangeThis) {
    Settings.setStorage(defaultSettings)
}

export default User