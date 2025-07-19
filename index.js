const sysConfig = require('./config.json')
const globalVariables = require('./systemServices/globalVariables')
const cmd = require('./systemServices/cmdPretty')

if (globalVariables.compactIntro) {
    cmd.log(cmd.colorize('Fur', 'brightYellow') + cmd.colorize('dex', 'brightCyan'))
} else {
    const label = [
        " ________                           __                     ",
        "|        \\                         |  \\                    ",
        "| $$$$$$$$__    __   ______    ____| $$  ______   __    __ ",
        "| $$__   |  \\  |  \\ /      \\  /      $$ /      \\ |  \\  /  \\",
        "| $$  \\  | $$  | $$|  $$$$$$\\|  $$$$$$$|  $$$$$$\\ \\$$\/  $$",
        "| $$$$$  | $$  | $$| $$   \\$$| $$  | $$| $$    $$  >$$  $$ ",
        "| $$     | $$__/ $$| $$      | $$__| $$| $$$$$$$$ /  $$$$\\ ",
        "| $$      \\$$    $$| $$       \\$$    $$ \\$$     \\|  $$ \\$$\\",
        " \\$$       \\$$$$$$  \\$$        \\$$$$$$$  \\$$$$$$$ \\$$   \\$$"
    ]

    for (const line of label) {
        cmd.log(cmd.colorize(line, 'brightCyan'))
    }
}

cmd.log(cmd.colorize(`Version: ${sysConfig.version}\n`, 'brightCyan'))

if (globalVariables.DEVmode) {
    cmd.info(`${cmd.colorize('Furdex', 'cyan')} is running in ${cmd.colorize('DEVELOPMENT', 'red')} mode, some features will not be available in production mode.`, [cmd.preps.Debug, cmd.preps.System])
}

require('./systemServices/DBmetaTags.js')()

require('./systemServices/checkFileIntegrity.js')()

require('./systemServices/sync-langs.js')

require('./systemServices/webServer.js')

require('./systemServices/filePersistencyChecker.js')
