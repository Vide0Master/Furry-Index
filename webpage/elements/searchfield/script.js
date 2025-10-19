import Elem from "../../components/elem/script.js";
import Icon from "../../components/icon/script.js";
import Language from "../../scripts/language.js";
import API from "../../scripts/api.js";
import Tag from "../tag/script.js";
import Link from "../../components/link/script.js";

export default class SearchField extends Elem {
    constructor(parent, autocompleteLink, navigation) {
        super("internal-search-field", parent)

        if (navigation?.prev) {
            new Link("<", `/post/${navigation.prev}${window.location.search}`, this.element, true, "nav-dir")
        }

        this.searchInput = new Elem("search-field", this.element, "input")
        this.searchInput.element.type = "text"
        this.searchInput.element.placeholder = `${Language.lang.elements.search.label}...`

        this.setSearch = (text) => {
            this.searchInput.element.value = text
        }

        const searchIcon = new Icon("search", this.element, "search-icon", "20x20")


        if (navigation?.next) {
            new Link(">", `/post/${navigation.next}${window.location.search}`, this.element, true, "nav-dir")
        }

        this.getTags = () => {
            return this.searchInput.element.value.split(" ").filter(v => v != "")
        }

        this.callbacks = []

        this.addSearchCB = (func) => {
            this.callbacks.push(func)
        }

        this.searchInput.addEvent("keydown", (e) => {
            switch (e.key) {
            case "Enter": {
                if (typeof autocompleteLink !== "string") this.startCallbacks();
            }; break
            case "Escape": {
                this.searchInput.element.blur()
            }; break
            }
        })

        searchIcon.addEvent("click", () => { this.startCallbacks() })

        if (typeof autocompleteLink === "string") {
            const autocompleteField = new Elem("search-autocomplete", this.element)

            const autocompleteVisible = (state) => {
                // autocompleteField.switchVisible(state)

                autocompleteField.element.classList.toggle("autocomplete-visible", state)
                this.element.classList.toggle("autocomplete-visible", state)
            }

            let currentTag = 0
            let tagsAutocomp = []

            let timeout

            const getTagsList = () => {
                return this.searchInput.element.value.split(" ").filter(tag => tag !== "")
            }

            this.searchInput.addEvent("keyup", async (e) => {
                if (["ArrowDown", "ArrowUp", "Enter"].includes(e.key)) return
                const tags = getTagsList()

                autocompleteVisible(false)
                autocompleteField.wipe()

                if (tags.length == 0) {
                    autocompleteField.switchVisible(false)
                    currentTag = 0
                    tagsAutocomp = []
                    if (timeout) clearTimeout(timeout)
                    return
                } else {
                    autocompleteField.switchVisible(true)
                }

                const latestTag = tags[tags.length - 1]

                if (latestTag.length < 2) {
                    currentTag = 0
                    tagsAutocomp = []
                    if (timeout) clearTimeout(timeout)
                    return
                }

                currentTag = 0
                tagsAutocomp = []

                if (timeout) clearTimeout(timeout)

                timeout = setTimeout(async () => {
                    const recommendations = await API("GET", `${autocompleteLink}?q=${latestTag}`)
                    autocompleteVisible(true)
                    recommendations.complete.sort((a, b) => b.count - a.count)
                    recommendations.complete.forEach((tag) => {
                        const tagElem = new Tag(tag, autocompleteField.element, true)
                        tagElem.addEvent("click", () => {
                            tags.pop()
                            tags.push(tag.name)
                            this.searchInput.element.value = tags.join(" ") + " "
                            currentTag = 0
                            tagsAutocomp = []

                            autocompleteVisible(false)
                            autocompleteField.wipe()
                        })
                        tagsAutocomp.push({ name: tag.name, elem: tagElem })
                    })
                }, 500)
            })

            this.searchInput.addEvent("keydown", async (e) => {
                if (!["ArrowDown", "ArrowUp", "Enter"].includes(e.key)) return

                const tags = getTagsList()

                e.preventDefault()

                tagsAutocomp.forEach((tag) => {
                    tag.elem.element.classList.toggle("active", false)
                })

                switch (e.key) {
                case "ArrowDown": {
                    currentTag++
                    if (currentTag >= tagsAutocomp.length) {
                        currentTag = tagsAutocomp.length
                    }
                }; break
                case "ArrowUp": {
                    currentTag--
                    if (currentTag <= 1) {
                        currentTag = 1
                    }
                }; break
                case "Enter": {
                    if (currentTag == 0) {
                        this.startCallbacks()
                        return
                    }

                    const selectedTag = tagsAutocomp[currentTag - 1].name
                    tags.pop()
                    tags.push(selectedTag)
                    this.searchInput.element.value = tags.join(" ") + " "
                    currentTag = 0
                    tagsAutocomp = []

                    autocompleteVisible(false)
                    autocompleteField.wipe()
                    return
                }; 
                }

                tagsAutocomp[currentTag - 1].elem.element.classList.toggle("active", true)

                
            })

            this.searchInput.addEvent("focusout", () => {
                setTimeout(() => {
                    autocompleteVisible(false)
                }, 100)
            })

            this.searchInput.addEvent("focusin", () => {
                if (tagsAutocomp.length > 0) autocompleteVisible(true)
            })
        }
    }

    startCallbacks() {
        const tags = this.getTags()
        const params = new URLSearchParams(window.location.search)

        if (tags.length) {
            params.set("tags", `${tags.join("+")}`)
        } else {
            params.delete("tags")
        }

        history.pushState({}, "", `${window.location.pathname}?${params.toString().replace(/%2B/g, "+")}`)

        this.callbacks.forEach((cb) => cb(tags))
    }
}
