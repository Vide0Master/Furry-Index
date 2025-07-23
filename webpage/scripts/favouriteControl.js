import Alert from "../features/alert/script.js"
import API from "./api.js"
import Language from "./language.js"
import User from "./userdata.js"

const favsLSName = 'favourites'

class Favourites {
    static localFavs = []

    static getCurrent() {
        if (User.loggedIn()) {
            this.localFavs = null
        } else {
            this.localFavs = JSON.parse(localStorage.getItem(favsLSName) || '[]')
        }
    }

    static async set(favs) {
        if (User.loggedIn()) {
            const resp = await API('PUT', `/api/favourites`, { posts: favs })
            return resp
        } else {
            localStorage.setItem(favsLSName, JSON.stringify(favs))
            this.localFavs = favs
        }
    }

    static async add(id) {
        if (User.loggedIn()) {
            const resp = await API('PUT', `/api/favourites`, { post: id })
            return resp.count
        } else {
            if (this.localFavs.length >= 50) {
                new Alert.Simple(Language.lang.features.favs.limit.content, Language.lang.features.favs.limit.top, null, '#ffffff', 'fav-adding-error')
            } else {
                this.localFavs.push(id)
                this.set(this.localFavs)
                return true
            }
        }
    }

    static async rm(id) {
        if (User.loggedIn()) {
            const resp = await API('DELETE', `/api/favourites`, { post: id })
            return resp.count
        } else {
            const idx = this.localFavs.indexOf(id);
            if (idx !== -1) {
                this.localFavs.splice(idx, 1);
                this.set(this.localFavs);
                return true
            }
        }
    }

    static async includes(id) {
        if (User.loggedIn()) {
            const resp = await API('GET', `/api/favourites?includes=${id}`)
            return resp.included
        } else {
            return this.localFavs.indexOf(id) != -1
        }
    }
}

Favourites.getCurrent()

export default Favourites
