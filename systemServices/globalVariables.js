const cfg = require('../config.json')
require('dotenv').config();

const constants = {
    DEVmode: process.env.ENVIROMENT == "DEV",
    EVALmode: process.env.ENVIROMENT == "EVAL",
    compactIntro: process.env.COMPACTINTRO,
    PORT: 0,
    APORT: false,
    mainAuthTokenKey: "FURRYINDEXUSERTOKEN",
    tempSessionTimeout: 5,
    version: cfg.version
}

if (!process.env.PORT) {
    constants.PORT = 3000
    constants.APORT = true
} else {
    constants.PORT = process.env.PORT
}

module.exports = constants