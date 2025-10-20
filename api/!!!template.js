// default route of all routes in file
exports.ROUTE = "/"

// default permissions of all routes in file
exports.PERMISSIONS = ["", ""]

// default data inclusion in file
exports.INCLUDE = ["", ""]

// route
exports.route = {
    name: "", // REQUIRED FOR WS!!! sets name for route(only for debug)/wslistener, alias: n 
    method: "GET", // REQUIRED!!!, alias: m
    route: "/", // override for default route, alias: r
    permissions: "", // override for default permissions, alias: p
    include: "", // override for default data inclusion, alias: i
    // eslint-disable-next-line no-unused-vars
    exec: async (req, res) => { //alias: e
        // code
    },
    kill: true // use to disable routes (later compatability for feature flags), alias: k
}
