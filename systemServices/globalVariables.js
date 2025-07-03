const cfg = require('../config.json')
require('dotenv').config();

const domain = 'vmtech.services'

const constants = {
    DEVmode: process.env.ENVIROMENT == "DEV",
    EVALmode: process.env.ENVIROMENT == "EVAL",
    compactIntro: process.env.COMPACTINTRO,
    PORT: 0,
    APORT: false,
    mainAuthTokenKey: "FURRYINDEXUSERTOKEN",
    tempSessionTimeout: 5,
    version: cfg.version,
    serverLink: ''
}

if (!process.env.PORT) {
    constants.PORT = 3000
    constants.APORT = true
} else {
    constants.PORT = process.env.PORT
}

switch (true) {
    case constants.DEVmode: {
        constants.serverLink = 'polygon-3k.' + domain
    }; break;
    case constants.EVALmode: {
        constants.serverLink = 'furry-index-eval.' + domain
    }; break;
    default: {
        constants.serverLink = 'furry-index.' + domain
    }; break;
}

module.exports = constants