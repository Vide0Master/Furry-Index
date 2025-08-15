const globalVariables = require('../systemServices/globalVariables')
const cmd = require('../systemServices/cmdPretty')
const fs = require('fs');
const path = require('path');

function scanRoutes(dir, excludeFile, baseDir = dir, routes = []) {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (fullPath === excludeFile) {
            return;
        }

        if (stat.isDirectory()) {
            scanRoutes(fullPath, excludeFile, baseDir, routes);
        } else {
            const relativePath = path.relative(baseDir, fullPath);
            routes.push('/' + relativePath.replace(/\\/g, '/'));
        }
    });

    return routes;
}

const apiFiles = scanRoutes(__dirname, __filename).map(v => "." + v)

const { webServer } = require('../systemServices/webServer');
const getUserBySessionCookie = require('../systemServices/getUserBySessionCookie');
const WSController = require('../systemServices/WebSocket');

const localRoutes = []

const routesNest = {}

routesNest.label = `List of loaded routes`
routesNest.childs = []

for (let i = 0; i < apiFiles.length; i++) {
    const module = require(apiFiles[i])
    let route

    if (module.ROUTE) {
        route = module.ROUTE
    } else {
        route = '/api/' + path.basename(apiFiles[i]).split('.')[0]
        cmd.warn(`Route file ${path.basename(apiFiles[i])} noes not have ${cmd.colorize('ROUTE', 'cyan')} export specified, fallback to default "${route}" route`, [cmd.preps.API])
    }

    let routeCounter = 0

    routesNest.childs.push({ label: route, childs: [] })
    const logIndex = routesNest.childs.findIndex(v => v.label == route)

    for (const method in module) {
        if (['ROUTE', 'PERMISSIONS'].includes(method)) continue
        if (!['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'WS'].includes(method)) {
            cmd.bad(`Method ${method} is not allowed, skipping`, [cmd.preps.API])
            continue
        }
        localRoutes.push({
            ROUTE: route,
            METHOD: method.toLowerCase(),
            FUNCTION: module[method],
            PERMISSIONS: module.PERMISSIONS ? module.PERMISSIONS : undefined
        })
        routeCounter++

        const prep = cmd.preps.APIs[method]
        routesNest.childs[logIndex].childs.push({ label: cmd.colorize(prep.text, prep.color) })
    }

    if (routeCounter == 0) {
        cmd.bad(`${path.basename(apiFiles[i])} does not contain any usable routes`, [cmd.preps.API])
    }
}

for (const routeID in localRoutes) {
    const route = localRoutes[routeID]
    const middlewares = []

    if (route.METHOD == 'ws') {
        WSController.registerListener(route.FUNCTION.name, route.FUNCTION.func)
        continue
    }

    if (route?.PERMISSIONS?.includes('REQUIRECOOKIE')) {
        middlewares.push(async (req, res, next) => {
            const userToken = req.cookies[globalVariables.mainAuthTokenKey]
            if (!userToken) {
                cmd.warn(`${cmd.colorize('401', 'red')} on route ${route.ROUTE} | No token "${globalVariables.mainAuthTokenKey}"`,
                    [cmd.preps.Debug, cmd.preps.http, cmd.preps.API, { text: req.method, color: 'yellow' }])
                return res.status(401).send()
            } else {
                next()
            }
        })
    }

    if (route?.PERMISSIONS?.includes('REQUIREUSER')) {
        middlewares.push(async (req, res, next) => {
            const user = await getUserBySessionCookie(req.cookies[globalVariables.mainAuthTokenKey])
            if (!user) {
                cmd.warn(`${cmd.colorize('401', 'red')} on route ${route.ROUTE} | No user`,
                    [cmd.preps.Debug, cmd.preps.http, cmd.preps.API, { text: req.method, color: 'yellow' }])
                return res.status(401).send()
            } else {
                next()
            }
        })
    }

    middlewares.push(route.FUNCTION);

    webServer[route.METHOD](route.ROUTE, ...middlewares)

}

cmd.nested(routesNest, [cmd.preps.API])


webServer.use((req, res) => {
    res.status(404).send('Route not found.');
    if (globalVariables.DEVmode)
        cmd.bad(req.path + ' ' + cmd.colorize(404, 'red'), [cmd.preps.Debug, cmd.preps.http, cmd.preps.API, { text: req.method, color: 'yellow' }])
});