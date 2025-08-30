const sysConfig = require('./config.json')
const globalVariables = require('./systemServices/globalVariables')
const cmd = require('./systemServices/cmdPretty')

if (globalVariables.compactIntro) {
    cmd.log(cmd.colorize('Furry', 'brightYellow') + '-' + cmd.colorize('Index', 'brightCyan'))
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

require('./systemServices/cron/cronJobs.js')
