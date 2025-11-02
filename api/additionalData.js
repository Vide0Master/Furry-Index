const { roleTemplates } = require("../systemServices/userRoleControl")

exports.ROUTE = "/api/data"

exports.Roles = {
    m: "get",
    r: "+/roles",
    e: async (req, res) => { return res.status(200).json({ roles: roleTemplates }) }
}