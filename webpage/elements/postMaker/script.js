import Button from "../../components/button/script.js";
import Elem from "../../components/elem/script.js";
import DropdownList from "../../components/dropdownList/script.js";
import SwitchInput from "../../components/switchinput/script.js";
import TextInputLine from "../../components/textinputline/script.js";
import FileCard from "../../elements/fileCard/script.js";
import Alert from "../../features/alert/script.js";
import Overlay from "../../features/overlay/script.js";
import API from "../../scripts/api.js";
import Language from "../../scripts/language.js";
import BigTextField from "../../components/bigtextfield/script.js";
import Link from "../../components/link/script.js";

export default async function makePostMaker(postData, editedCB) {
    const overlay = new Overlay(false)

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

    const filesField = new Elem(["files-list", "hidden"], container.element)

    const noFiles = new Elem("no-files", container.element)
    new Elem(null, noFiles.element).text = Language.lang.elements.postMaker.noFilesText
    new Link(Language.lang.settings.user.uploadFile, "/upload", noFiles.element, true, null, "upload")
    noFiles.switchVisible(false)

    async function getFiles(type, presentFiles) {
        PostData.files = presentFiles ? presentFiles : [];
        PostData.type = type;
        filesField.element.innerHTML = "";

        const tags = [];
        if (["image", "imageGroup", "comic"].includes(type)) tags.push("image");
        else if (["video", "videoGroup"].includes(type)) tags.push("animated");

        const files = await API("GET", `/api/files?inuse=${postData ? `postID:${postData.id}` : "false"}&t=10${tags.length > 0 ? "&tags=" + tags.join("+") : ""}`);

        if (files.files.length === 0) {
            filesField.switchVisible(false);
            noFiles.switchVisible(true);
            return;
        } else {
            filesField.switchVisible(true);
            noFiles.switchVisible(false);
        }

        const switches = {};
        const fileCards = {};

        for (const file of files.files) {
            const fcard = new FileCard(file, false, filesField.element, { remove: false });
            fileCards[file.id] = fcard;

            switches[file.id] = new SwitchInput(Language.lang.elements.postMaker.include, fcard.element, (state) => {
                if (["image", "video"].includes(type)) {
                    for (const id in switches) {
                        if (id == file.id) continue;
                        switches[id].change(false);
                    }

                    PostData.files = state ? [file.id] : [];
                } else {
                    const idindex = PostData.files.indexOf(file.id);
                    if (state && idindex === -1) PostData.files.push(file.id);
                    else if (!state && idindex !== -1) PostData.files.splice(idindex, 1);
                }
            });

            const orderRow = new Elem("order-row", fcard.element);
            orderRow.moveBefore(fcard.fileid.element)
            if (["image", "video"].includes(type)) { orderRow.switchVisible(false) }
            new Button("<", orderRow.element, null, () => {
                moveFile(file.id, -1);
            });
            new Button(">", orderRow.element, null, () => {
                moveFile(file.id, 1);
            });

            if (PostData.files.includes(file.id)) switches[file.id].change(true);
        }

        function moveFile(fileId, direction) {
            const index = PostData.files.indexOf(fileId);
            if (index === -1) return;

            const newIndex = index + direction;
            if (newIndex < 0 || newIndex >= PostData.files.length) return;

            const otherId = PostData.files[newIndex];

            const parent = filesField.element;
            const nodeA = fileCards[fileId].element;
            const nodeB = fileCards[otherId].element;

            [PostData.files[index], PostData.files[newIndex]] = [PostData.files[newIndex], PostData.files[index]];

            if (direction > 0) {
                parent.insertBefore(nodeB, nodeA);
            } else {
                parent.insertBefore(nodeA, nodeB);
            }
        }
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
