import API from "./api.js"

class User {
    static data = null

    static async updateUserData() {
        const userRequestResult = await API('GET', '/api/auth', null, true)

        if (userRequestResult.HTTPCODE == 200) {
            delete userRequestResult.HTTPCODE
            this.data = userRequestResult
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