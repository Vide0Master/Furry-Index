import Button from "../../components/button/script.js";
import Header from "../../components/header/script.js";
import UserLabel from "../../elements/userLabel/script.js";
import Alert from "../../features/alert/script.js";
import Router from "../../scripts/router.js";
import User from "../../scripts/userdata.js";
import DropdownList from "../../components/dropdownList/script.js";
import Elem from "../../components/elem/script.js";
import Language from "../../scripts/language.js";
import Overlay from "../../features/overlay/script.js";
import API from "../../scripts/api.js";
import FileCard from "../../elements/fileCard/script.js";

export const tag = "settings";
export const tagLimit = 1;

export async function render(params) {
    const container = new Elem('settings-container')

    const pages = {}

    const settingsRow = new Elem('settings-selector-row', container.element)
    new Elem('label', settingsRow.element).text = Language.lang.settings.label

    const ddlist = new DropdownList([
        {
            name: Language.lang.settings.typeSwitch.webpage,
            value: 'webpage',
            selected: true
        },
        {
            name: Language.lang.settings.typeSwitch.user,
            value: 'user'
        }
    ], settingsRow.element, Language.lang.settings.typeSwitch.placeholder, (value) => {
        for (const page in pages) {
            if (pages[page].element && value == page) {
                pages[page].element.classList.toggle('hidden', false)
            } else {
                pages[page].element.classList.toggle('hidden', true)
            }
        }
    });

    if (!User.data) { ddlist.element.classList.add('hidden'); }

    pages.webpage = new Elem('webpage-settings', container.element);

    new DropdownList(
        Language.availableLanguages.map((k) => ({
            name: Language.lang.settings.webpage.language[k],
            value: k,
            selected: Language.currentLang == k
        })),
        pages.webpage.element, 'Language', (val) => {
            Language.setLanguage(val)
        })

    if (User.data) {
        pages.user = new Elem(['user-settings', 'hidden'], container.element);

        new Button(`${Language.lang.settings.user.logout} ${User.data.username}`, pages.user.element, null, async () => {
            const username = User.data.username
            User.unlogin(async () => {
                Router.navigate('/')
                UserLabel.checkUserData()
                Header.checkUserLoginState()
            })
            new Alert.Simple(`${Language.lang.profile.loggedOut[0]} ${username} ${Language.lang.profile.loggedOut[1]}`, null, 5000)
        })

        const avatarLine = new Elem('avatar-line', pages.user.element)

        const rmAvatar = new Button('Rm avatar', avatarLine.element, null, async () => {
            new Alert.Confirm('Are you sure you want to remove your avatar?', null, async () => {
                const rmResult = await API('DELETE', `/api/profile/${User.data.username}/avatar`)
                if (rmResult.HTTPCODE == 200) {
                    await User.updateUserData()
                    UserLabel.checkUserData()
                    rmAvatar.element.classList.toggle('hidden', true)
                }
            })
        })
        if (!User.data.avatar) rmAvatar.element.classList.toggle('hidden', true)
        
        const selAvatar = new Button(Language.lang.settings.user.selectAvatar, avatarLine.element, null, async () => {
            const overlay = new Overlay()

            const avatarSelector = new Elem('avatar-selector', overlay.element)

            const files = await API('GET', '/api/files?inuse=false&tags=image&t=5')

            new Elem('label', avatarSelector.element).text = 'Select an avatar image'

            const fileList = new Elem('file-list', avatarSelector.element)

            for (const file of files.files) {
                const fileElem = new FileCard(file, false, fileList.element, { remove: false })
                new Button('Choose', fileElem.element, null, async () => {
                    const avatarSetResult = await API('PUT', `/api/profile/${User.data.username}/avatar`, { id: file.id })
                    if (avatarSetResult.HTTPCODE == 200) {
                        overlay.element.click()
                        await User.updateUserData()
                        UserLabel.checkUserData()
                        rmAvatar.element.classList.toggle('hidden', false)
                    }
                })
            }
        })

        rmAvatar.moveAfter(selAvatar.element)
    }

    return container.element;
}

