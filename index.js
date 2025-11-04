const sysConfig = require("./config.json")
const globalVariables = require("./systemServices/globalVariables")
const cmd = require("./systemServices/cmdPretty")

async function init() {
    if (globalVariables.compactIntro) {
        cmd.log(cmd.colorize("\n✦ Furry-Index ✦", "brightCyan"))
    } else {
        const label = [
            " ________                                               ______                  __                     ",
            "|        \\                                             |      \\                |  \\                    ",
            "| $$$$$$$$__    __   ______    ______   __    __        \\$$$$$$ _______    ____| $$  ______   __    __ ",
            "| $$__   |  \\  |  \\ /      \\  /      \\ |  \\  |  \\ ______ | $$  |       \\  /      $$ /      \\ |  \\  /  \\",
            "| $$  \\  | $$  | $$|  $$$$$$\\|  $$$$$$\\| $$  | $$|      \\| $$  | $$$$$$$\\|  $$$$$$$|  $$$$$$\\ \\$$\\/  $$",
            "| $$$$$  | $$  | $$| $$   \\$$| $$   \\$$| $$  | $$ \\$$$$$$| $$  | $$  | $$| $$  | $$| $$    $$  >$$  $$",
            "| $$     | $$__/ $$| $$      | $$      | $$__/ $$       _| $$_ | $$  | $$| $$__| $$| $$$$$$$$ /  $$$$\\ ",
            "| $$      \\$$    $$| $$      | $$       \\$$    $$      |   $$ \\| $$  | $$ \\$$    $$ \\$$     \\|  $$ \\$$\\",
            " \\$$       \\$$$$$$  \\$$       \\$$       _\\$$$$$$$       \\$$$$$$ \\$$   \\$$  \\$$$$$$$  \\$$$$$$$ \\$$   \\$$",
            "                                       |  \\__| $$                                                      ",
            "                                        \\$$    $$                                                      ",
            "                                         \\$$$$$$                                                       "
        ]

        for (const line of label) {
            cmd.log(cmd.colorize(line, "brightCyan"))
        }
    }

    cmd.log(cmd.colorize(`Version: ${sysConfig.version}\n`, "brightCyan"))

    let ENVError = false

    if (!["REL", "EVAL", "DEV"].includes(process.env.ENVIROMENT)) {
        cmd.cerr("No ENVIROMENT mentioned in env!", [cmd.preps.System, cmd.preps.env])
        ENVError = true
    }

    if (!process.env.DATABASE_URL) {
        cmd.cerr("No DATABASE_URL mentioned in env!", [cmd.preps.System, cmd.preps.env])
        ENVError = true
    }

    if (!process.env.FIPORT) {
        cmd.cerr("No FIPORT mentioned in env!", [cmd.preps.System, cmd.preps.env])
        ENVError = true
    }

    if (!process.env.MAILSERVER) {
        cmd.cerr("No MAILSERVER mentioned in env!", [cmd.preps.System, cmd.preps.config])
        ENVError = true
    }

    if (!process.env.MAILBOX) {
        cmd.cerr("No MAILBOX mentioned in env!", [cmd.preps.System, cmd.preps.config])
        ENVError = true
    }

    if (!process.env.MAILBOXPASS) {
        cmd.cerr("No MAILBOXPASS mentioned in env!", [cmd.preps.System, cmd.preps.config])
        ENVError = true
    }

    if (process.env.ISFRESH) {
        cmd.cerr(".env config is fresh, edit it!", [cmd.preps.System, cmd.preps.config])
        ENVError = true
    }

    if (ENVError) return

    if (globalVariables.DEVmode) {
        cmd.info(`${cmd.colorize("Furdex", "cyan")} is running in ${cmd.colorize("DEVELOPMENT", "red")} mode, some features will not be available in production mode.`, [cmd.preps.Debug, cmd.preps.System])
    }

    // i wanna leave here my little reminder for someone who will look into this code
    // and code of keygen
    // it looks really simple, but there is one small issue
    // there is 22452257707354557240087211123792674816 combinations of key
    // so, hypothetically, no one can hijack key to superadmin permissions

    // i'm back with some calculations
    // to find exact key, by randomly trying, without repeats
    // you need... erm... almost 2 or 3 universe lifespans to find exact key
    // good luck

    // oh, for thoose who think quantum computing will help them
    // for fucks sake no
    // it will not help

    // hardware that is currently (15.09.2025) hosting this server is fucking  Xeon E5-2670 v3
    // and little 32 gigs of RAM
    // and broken as mindfucked slut hard drive
    // I physycally CAN'T make server listen to requests that fast as quantum computer wants
    // so
    // go solve more interesting questions with it
    // maybe gamble with it (and become broke), idk

    // also, i forgor
    // key changes everytime when server restarts
    // each update, or any major error will cause key to reset
    // :D

    async function setAdminKey() {
        const KC = require("./systemServices/keyControl.js")
        const adminKey = await KC.createKey("superadminassign", {}, true)
        cmd.info(`Admin role key ${cmd.colorize(adminKey, "red")}`, [cmd.preps.System])
        cmd.warn(cmd.colorize("DO NOT SHARE ADMIN KEY WITH ANYONE\nIT GIVES ALMOST UNRESTRICTED ACCES TO THE APP", "red"), [cmd.preps.System])
    }

    await setAdminKey()

    await require("./systemServices/DBmetaTags.js")()

    await require("./systemServices/checkFileIntegrity.js")()

    require("./systemServices/sync-langs.js")

    require("./systemServices/webServer.js")

    require("./systemServices/cron/cronJobs.js")
}

init()