import Alert from "../features/alert/script.js"
import API from "./api.js"

const defaultSettings = {
    postsPerPage: 50,
    filesPerPage: 50
}

class Settings {
    static getStorage = () => {
        return JSON.parse(localStorage.getItem('settings') || '{}')
    }

    static setStorage = async (data) => {
        localStorage.setItem('settings', JSON.stringify(data))

        if (User.data) {
            (async () => {
                const update = await API('PUT', `/api/profile/${User.data.username}`, { privateprofileparams: data })
                if (update.HTTPCODE !== 200) {
                    new Alert.Simple('Error', 'Error while updating remote user settings', 5000, null, 'remoteusersettingerror')
                }
            })()
        }
    }

    static get(name) {
        return this.getStorage()[name]
    }

    static set(name, value) {
        const data = this.getStorage()
        data[name] = value
        this.setStorage(data)
    }
}

if (Settings.getStorage() == {}) {
    Settings.setStorage(defaultSettings)
}

class User {
    static data = null

    get settings() { return Settings.getStorage() }

    static Settings = Settings

    static async updateUserData() {
        const userRequestResult = await API('GET', '/api/auth', null, true)

        if (userRequestResult.HTTPCODE == 200) {
            delete userRequestResult.HTTPCODE
            this.data = userRequestResult
            this.Settings.setStorage(userRequestResult.privateprofileparams || defaultSettings)
        } else {
            this.data = null
        }
    }

    static async unlogin(cb) {
        const unloginRslt = await API('DELETE', '/api/auth', {}, true)
        await this.updateUserData()
        cb(unloginRslt.HTTPCODE == 200)
    }

    static loggedIn() {
        return this.data != null
    }
}

export default User