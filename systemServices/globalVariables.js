const cfg = require('../config.json');
const cmd = require('./cmdPretty.js');
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
    serverLink: '',
    adminKey: ''
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
    const KC = require('./keyControl.js')
    constants.adminKey = await KC.createKey('superadminassign', {}, true)
    cmd.info(`Admin role key ${cmd.colorize(constants.adminKey, 'red')}`, [cmd.preps.System])
    cmd.warn(cmd.colorize('DO NOT SHARE ADMIN KEY WITH ANYONE\nIT GIVES ALMOST UNRESTRICTED ACCES TO THE APP', 'red'), [cmd.preps.System])
}

setAdminKey()

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

