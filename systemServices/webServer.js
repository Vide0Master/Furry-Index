const globalVariables = require('./globalVariables')
const cmd = require('./cmdPretty')
const express = require('express');
const http = require('http')
const WebSocket = require('ws');
const path = require('path');
const expressServer = express();
const sass = require('sass');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const UAParser = require('ua-parser-js');

const server = http.createServer(expressServer)
const wss = new WebSocket.Server({ server })

expressServer.use((req, res, next) => {
    if (!req.path.endsWith('.css')) return next();

    const cssPath = req.path;
    const scssPath = path.join(__dirname, '../webpage', cssPath.replace(/\.css$/, '.scss'));
    const sassPath = path.join(__dirname, '../webpage', cssPath.replace(/\.css$/, '.sass'));
    let fileToCompile = null;

    if (fs.existsSync(scssPath)) {
        fileToCompile = scssPath;
    } else if (fs.existsSync(sassPath)) {
        fileToCompile = sassPath;
    }

    if (!fileToCompile) return next();

    try {
        const result = sass.compile(fileToCompile, { style: 'expanded' });
        res.setHeader('Content-Type', 'text/css');
        res.send(result.css);
    } catch (err) {
        console.error('SCSS compilation error:', err);
        res.status(500).send('SCSS compilation failed');
    }
});

expressServer.use(express.static(path.join(__dirname, '../webpage')))

expressServer.use(express.json())

expressServer.use(cookieParser())

//user agent parser
expressServer.use((req, res, next) => {
    const headers = req.headers;
    const parser = new UAParser(headers['user-agent']);

    const uaResult = parser.getResult();

    req.clientInfo = {
        browser: uaResult.browser.name || 'Unknown',
        browserVersion: uaResult.browser.version || '',
        os: uaResult.os.name || 'Unknown',
        osVersion: uaResult.os.version || '',
        deviceType: uaResult.device.type || 'desktop',
        platform: headers['sec-ch-ua-platform']?.replace(/"/g, '') || uaResult.os.name,
        isMobile: headers['sec-ch-ua-mobile'] === '?1' || uaResult.device.type === 'mobile',
    };

    next();
})

server.listen(globalVariables.PORT, () => {
    cmd.awesome(`Web and WebSocket server started on port ${cmd.colorize(globalVariables.PORT, 'blue')}!`, [cmd.preps.System])

    if (globalVariables.APORT)
        cmd.warn(`Port was not found in ${cmd.colorize('ENV', 'yellow')} varibles, automatically assigned ${cmd.colorize('3000', 'blue')}`,
            [cmd.preps.System])

    require('../api/APIController')

    if (globalVariables.DEVmode)
        cmd.info(`Link to local page: ${cmd.colorize(`http://localhost:${globalVariables.PORT}`, 'cyan')}`,
            [cmd.preps.Debug, cmd.preps.http])
});

module.exports = { webServer: expressServer, wsServer: wss }