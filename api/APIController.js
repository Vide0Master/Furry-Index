const globalVariables = require("../systemServices/globalVariables")
const cmd = require("../systemServices/cmdPretty")
const fs = require("fs");
const path = require("path");

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
            routes.push("/" + relativePath.replace(/\\/g, "/"));
        }
    });

    return routes;
}

const apiFiles = scanRoutes(__dirname, __filename).map(v => "." + v)

const { webServer } = require("../systemServices/webServer");
const getUserBySessionCookie = require("../systemServices/getUserBySessionCookie");
const WSController = require("../systemServices/WebSocket");

for (let i = 0; i < apiFiles.length; i++) {
    const module = require(apiFiles[i])

    const moduleRoute = module.ROUTE
    const modulePermissions = module.PERMISSIONS
    const moduleInclude = module.INCLUDE

    //region method perm
    for (const func in module) {
        if (["ROUTE", "PERMISSIONS", "INCLUDE"].includes(func)) continue

        const moduleFunc = module[func]
        if (moduleFunc?.kill || moduleFunc?.k) continue

        const funcMethod = (moduleFunc?.method || moduleFunc?.m)?.toLowerCase()
        const funcRoute = moduleFunc?.route || moduleFunc?.r || moduleRoute
        const funcName = moduleFunc?.name || moduleFunc?.n
        const funcPerm = moduleFunc?.permissions || moduleFunc?.p || modulePermissions
        const funcExec = moduleFunc?.exec || moduleFunc?.e
        const funcInc = moduleFunc?.include || moduleFunc?.i || moduleInclude

        if (globalVariables.DEVmode) {
            if (typeof funcMethod !== "string") {
                cmd.err(`No method`, [cmd.preps.Debug, cmd.preps.API, cmd.preps.http, { text: `FILE:${apiFiles[i]}`, color: "green" }, { text: `ID:${func}`, color: "green" }])
                continue
            }

            if (funcMethod === "ws") {
                if (typeof funcName !== "string") {
                    if (typeof funcRoute !== "string") {
                        cmd.err(`No WS name`, [cmd.preps.Debug, cmd.preps.API, cmd.preps.ws, { text: `FILE:${apiFiles[i]}`, color: "green" }, { text: `ID:${func}`, color: "green" }])
                        continue
                    }
                }
            } else {
                if (typeof funcRoute !== "string" && !(funcRoute instanceof RegExp)) {
                    cmd.err(`No route`, [cmd.preps.Debug, cmd.preps.API, cmd.preps.http, { text: `FILE:${apiFiles[i]}`, color: "green" }, { text: `ID:${func}`, color: "green" }])
                    continue
                }

                if (typeof funcExec !== "function") {
                    cmd.err(`No function`, [cmd.preps.Debug, cmd.preps.API, cmd.preps.http, { text: `FILE:${apiFiles[i]}`, color: "green" }, { text: `ID:${func}`, color: "green" }])
                    continue
                }
            }
        }

        if (funcMethod === "ws") {
            WSController.registerListener(funcName, funcExec)

            if (globalVariables.DEVmode)
                cmd.info(`Registered ${cmd.colorize("WS", "green")} listener ${funcName}`, [cmd.preps.Debug, cmd.preps.API, cmd.preps.ws])
        } else {
            const middlewares = []

            if (funcPerm?.includes("REQUIRECOOKIE")) {
                middlewares.push(async (req, res, next) => {
                    const userToken = req.cookies[globalVariables.mainAuthTokenKey]
                    if (!userToken) {
                        cmd.warn(`${cmd.colorize("401", "red")} on route ${funcRoute} | No token "${globalVariables.mainAuthTokenKey}"`,
                            [cmd.preps.Debug, cmd.preps.http, cmd.preps.API, { text: req.method, color: "yellow" }])
                        return res.status(401).send()
                    } else {
                        next()
                    }
                })
            }

            if (funcPerm?.includes("REQUIREUSER")) {
                middlewares.push(async (req, res, next) => {
                    const user = await getUserBySessionCookie(req.cookies[globalVariables.mainAuthTokenKey])
                    if (!user) {
                        cmd.warn(`${cmd.colorize("401", "red")} on route ${funcRoute} | No user`,
                            [cmd.preps.Debug, cmd.preps.http, cmd.preps.API, { text: req.method, color: "yellow" }])
                        return res.status(401).send()
                    } else {
                        next()
                    }
                })
            }

            if (funcInc?.includes("USER")) {
                middlewares.push(async (req, res, next) => {
                    const user = await getUserBySessionCookie(req.cookies[globalVariables.mainAuthTokenKey])
                    req.USER = user
                    next()
                })
            }

            middlewares.push(funcExec);

            webServer[funcMethod](funcRoute, ...middlewares)

            if (globalVariables.DEVmode)
                cmd.info(`Registered ${cmd.colorize(cmd.preps.APIs[funcMethod.toUpperCase()].text, cmd.preps.APIs[funcMethod.toUpperCase()].color)} listener for ${funcRoute}`, [cmd.preps.Debug, cmd.preps.API, cmd.preps.http])
        }
    }
}

if (globalVariables.DEVmode)
    webServer.use((req, res) => {
        res.status(404).send("Route not found.");
        if (globalVariables.DEVmode)
            cmd.bad(req.path + " " + cmd.colorize(404, "red"), [cmd.preps.Debug, cmd.preps.http, cmd.preps.API, { text: req.method, color: "yellow" }])
    });
