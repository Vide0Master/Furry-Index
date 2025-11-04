import Button from "../../components/button/script.js";
import Elem from "../../components/elem/script.js";
import DropdownList from "../../components/dropdownList/script.js";
import TextInputLine from "../../components/textinputline/script.js";
import FileCard from "../../elements/fileCard/script.js";
import Alert from "../../features/alert/script.js";
import Overlay from "../../features/overlay/script.js";
import API from "../../scripts/api.js";
import Language from "../../scripts/language.js";
import BigTextField from "../../components/bigtextfield/script.js";
import Link from "../../components/link/script.js";
import PageNavigator from "../pagenavigator/script.js";

export default async function makePostMaker(postData, editedCB) {
    const overlay = new Overlay(false)

    const postsPerPageInSelectors = 10

    const container = new Elem("postmaker-post-container", overlay.element)

    const PostData = {
        name: postData?.name || "",
        description: postData?.description || "",
        type: postData?.type || "",
        rating: postData?.rating || "",
        files: postData?.files.map(file => file.id) || [],
        tags: postData?.tags
            .filter(tag => !tag?.group || tag.group.basename !== "meta")
            .map(tag => tag.name) || []
    }

    const postname = new TextInputLine(Language.lang.elements.postMaker.postName, container.element, null, null, (value) => {
        PostData.name = value
    })
    postname.value = PostData.name != "" ? PostData.name : ""

    const postdesc = new BigTextField(Language.lang.elements.postMaker.postDesc, container.element, 2000, (value) => {
        PostData.description = value
    })
    postdesc.value = PostData.description != "" ? PostData.description : ""

    new DropdownList(
        (await API("GET", "/api/posts/data?q=rating", null, true)).types.map(val => ({ name: Language.lang.elements.postCard.rating[val], value: val })),
        container.element, Language.lang.elements.postMaker.postRating, (val) => { PostData.rating = val }
    ).value = PostData.rating != "" ? PostData.rating : "placeholder"

    const postType = new DropdownList(
        (await API("GET", "/api/posts/data?q=types", null, true)).types.map(val => ({ name: Language.lang.elements.postCard.type[val], value: val })),
        container.element, Language.lang.elements.postMaker.postType, getFiles
    )
    postType.value = PostData.type != "" ? PostData.type : "placeholder"

    const fileSelector = new Elem("file-selector", container)
    new Elem("label", fileSelector).text = "Used files"
    const usedFilesField = new Elem("files-list", fileSelector)
    const usedPageNav = new PageNavigator(1, 1, fileSelector, true)
    new Elem("label", fileSelector).text = "Available files"
    const availalbeFilesField = new Elem("files-list", fileSelector)
    const availalbePageNav = new PageNavigator(1, 1, fileSelector, true)

    const noFiles = new Elem("no-files", container.element)
    new Elem(null, noFiles.element).text = Language.lang.elements.postMaker.noFilesText
    new Link(Language.lang.settings.user.uploadFile, "/upload", noFiles.element, true, null, "upload")
    noFiles.switchVisible(false)

    // Updated file selector helpers: include/exclude/move + id:<ids> tag search + PageNavigator integration
    // Assumes the following globals exist in your environment:
    // - Elem, Button, Link, FileCard, API, PostData, postData, postsPerPageInSelectors, PageNavigator

    async function searchFiles(tags = [], page = 0, take = 10, count = false) {
        const params = new URLSearchParams();

        if (tags && tags.length > 0) {
            // tags are joined by + as your backend expects; tags can contain commas (eg. id:1,2,3)
            params.set("tags", tags.join("+"));
        }

        if (count) {
            params.set("count", "true");
        } else {
            if (page) params.set("p", page);
            if (take) params.set("t", take);
        }

        const query = params.toString() ? `?${params.toString()}` : "";
        const resp = await API("GET", `/api/files${query}`);
        return resp;
    }

    async function getFiles(type, presentFiles) {
        PostData.files = presentFiles ? presentFiles.slice() : [];
        PostData.type = type;

        usedFilesField.wipe();
        availalbeFilesField.wipe();

        let postFileType = "";
        if (["image", "imageGroup", "comic"].includes(type)) postFileType = "image";
        else if (["video", "videoGroup"].includes(type)) postFileType = "animated";

        const tagsForAvailableBase = () => [postFileType, `notUsed:1`].filter(Boolean);
        const tagsForUsedBase = () => {
            if (PostData.files && PostData.files.length > 0) {
                return [postFileType, `id:${PostData.files.join(",")}`].filter(Boolean);
            }
            return [postFileType, `usedByPost:${postData.id}`].filter(Boolean);
        };

        function refreshNoFilesBlock() {
            if (!PostData.files || PostData.files.length === 0) {
                usedFilesField.switchVisible(false);
                noFiles.switchVisible(true);
            } else {
                usedFilesField.switchVisible(true);
                noFiles.switchVisible(false);
            }
        }

        function moveFileInArray(fileId, direction) {
            const idx = PostData.files.indexOf(fileId);
            if (idx === -1) return;
            const newIdx = idx + direction;
            if (newIdx < 0 || newIdx >= PostData.files.length) return;
            const tmp = PostData.files[newIdx];
            PostData.files[newIdx] = PostData.files[idx];
            PostData.files[idx] = tmp;
        }

        async function rerender(currentUsedPage = 0, currentAvailPage = 0) {
            await Promise.all([
                searchForUsedFiles(currentUsedPage, postsPerPageInSelectors),
                searchUnusedFiles(currentAvailPage, postsPerPageInSelectors)
            ]);
        }

        async function searchForUsedFiles(page = 0, take = postsPerPageInSelectors) {
            refreshNoFilesBlock();

            const tags = tagsForUsedBase();

            if (tags.includes(`id:`) && (!PostData.files || PostData.files.length === 0)) {
                usedFilesField.wipe();
                usedPageNav.renderButtons(1, 1);
                return;
            }

            const resp = await searchFiles(tags, page, take);
            usedFilesField.wipe();

            const filesMap = {};
            for (const f of resp.files || []) filesMap[f.id] = f;

            const orderToRender = (PostData.files && PostData.files.length > 0) ? PostData.files : (resp.files || []).map(f => f.id);

            for (const fid of orderToRender) {
                const file = filesMap[fid];
                if (!file) continue;

                const fcard = new FileCard(file, false, usedFilesField.element, { remove: false });

                new Button("exclude", fcard.element, "include-btn", () => {
                    const idx = PostData.files.indexOf(file.id);
                    if (idx !== -1) PostData.files.splice(idx, 1);
                    rerender(0, 0);
                });

                if (!["image", "video"].includes(type)) {
                    const orderRow = new Elem("order-row", fcard.element);

                    new Button("<", orderRow.element, null, () => {
                        moveFileInArray(file.id, -1);
                        rerender(0, 0);
                    });
                    new Button(">", orderRow.element, null, () => {
                        moveFileInArray(file.id, 1);
                        rerender(0, 0);
                    });
                }
            }

            try {
                const countResp = await searchFiles(tags, 0, 0, true);
                const pages = Math.max(1, Math.ceil((countResp.count || 0) / postsPerPageInSelectors));
                const curr = Math.min(Math.max(1, page + 1), pages);
                usedPageNav.renderButtons(pages, curr);
            } catch {
                usedPageNav.renderButtons(1, 1);
            }

            refreshNoFilesBlock();
        }

        async function searchUnusedFiles(page = 0, take = postsPerPageInSelectors) {
            const tags = tagsForAvailableBase();
            const resp = await searchFiles(tags, page, take);

            availalbeFilesField.wipe();

            const visibleFiles = (resp.files || []).filter(f => !PostData.files.includes(f.id));

            for (const file of visibleFiles) {
                const fcard = new FileCard(file, false, availalbeFilesField.element, { remove: false });

                new Button("include", fcard.element, "include-btn", () => {
                    if (["image", "video"].includes(type)) {
                        PostData.files = [file.id];
                    } else {
                        if (!PostData.files.includes(file.id)) PostData.files.push(file.id);
                    }
                    rerender(0, page);
                });
            }

            try {
                const countResp = await searchFiles(tags, 0, 0, true);
                const pages = Math.max(1, Math.ceil((countResp.count || 0) / postsPerPageInSelectors));
                const curr = Math.min(Math.max(1, page + 1), pages);
                availalbePageNav.renderButtons(pages, curr);
            } catch {
                availalbePageNav.renderButtons(1, 1);
            }
        }

        usedPageNav.addNavCB(async (page) => {
            await searchForUsedFiles(page - 1, postsPerPageInSelectors);
        });

        availalbePageNav.addNavCB(async (page) => {
            await searchUnusedFiles(page - 1, postsPerPageInSelectors);
        });

        await rerender(0, 0);
    }

    if (PostData.files.length != 0) getFiles(postType.value, PostData.files)

    const tagsField = new BigTextField(Language.lang.elements.postMaker.tags, container.element, "custom", (val) => {
        const endsWithSpace = val.endsWith(" ")
        val = val.toLowerCase()

        let tags = val
            .split(/[ ,]+/) // split string by spaces and commas
            .map(tag => tag
                .replace(/[^a-z0-9_\-:/]/gi, "") // prevent use of special symbols
                .replace(/^-+/, "")              // kill "-" in front of tag
                .slice(0, 30)                    // max tag size 30 symbols
            )
            .filter(tag => tag !== "")

        const uniqueTags = []
        for (const tag of tags) {
            if (!uniqueTags.includes(tag)) {
                uniqueTags.push(tag)
            }
        }

        if (uniqueTags.length > 100) {
            uniqueTags.length = 100
        }

        tagsField.setLimit(uniqueTags.length, 100)
        PostData.tags = uniqueTags

        const shouldKeepSpace = endsWithSpace || (val.length > 0 && uniqueTags.length < tags.length)

        tagsField.value = uniqueTags.join(" ") + (shouldKeepSpace ? " " : "")
    })


    if (PostData.tags.length > 0) {
        tagsField.setLimit(PostData.tags.length, 100)
        tagsField.value = PostData.tags.join(" ")
    } else {
        tagsField.setLimit(0)
    }

    const btnRow = new Elem("btn-row", container.element)

    new Button(postData ? Language.lang.elements.postMaker.editPost : Language.lang.elements.postMaker.createPost, btnRow.element, null, async () => {
        switch (true) {
            case PostData.name.length == 0: {
                new Alert.Simple(Language.lang.elements.postMaker.noName, Language.lang.elements.postMaker.errorLabel, 3000, null, "noname")
                return
            };
            case PostData.rating.length == 0: {
                new Alert.Simple(Language.lang.elements.postMaker.noRating, Language.lang.elements.postMaker.errorLabel, 3000, null, "norating")
                return
            };
            case PostData.type.length == 0: {
                new Alert.Simple(Language.lang.elements.postMaker.noType, Language.lang.elements.postMaker.errorLabel, 3000, null, "notype")
                return
            };
            case PostData.files.length == 0: {
                new Alert.Simple(Language.lang.elements.postMaker.noFiles, Language.lang.elements.postMaker.errorLabel, 3000, null, "nofiles")
                return
            };
        }

        if (postData) {
            const postResult = await API("PUT", `/api/posts/${postData.id}`, PostData, true)
            if (postResult.HTTPCODE == 200) {
                new Alert.Simple(`${Language.lang.elements.postMaker.successEdit[0]} "${postData.name}" ${Language.lang.elements.postMaker.successEdit[1]}!`, "Success", 5000, null, postResult.postID)
                overlay.close()
                await editedCB()
            }
        } else {
            const postResult = await API("POST", `/api/posts`, PostData, true)
            if (postResult.HTTPCODE == 200) {
                new Alert.Simple(`${Language.lang.elements.postMaker.successCreate[0]} "${PostData.name}" ${Language.lang.elements.postMaker.successCreate[1]}!`, "Success", 5000, null, postResult.postID)
                overlay.close()

                const params = new URLSearchParams(window.location.search);
                if (params.get("create") === "true") {
                    params.delete("create");
                    const newQuery = params.toString();
                    const newUrl = newQuery
                        ? `${window.location.pathname}?${newQuery}`
                        : window.location.pathname;

                    history.replaceState({}, "", newUrl);
                }

                await editedCB()
            }
        }
    })

    new Button(Language.lang.features.alert.confirm.cancel, btnRow.element, null, () => {
        overlay.close()
        const params = new URLSearchParams(window.location.search);
        if (params.get("create") === "true") {
            params.delete("create");
            const newQuery = params.toString();
            const newUrl = newQuery
                ? `${window.location.pathname}?${newQuery}`
                : window.location.pathname;

            history.replaceState({}, "", newUrl);
        }
    })
}
