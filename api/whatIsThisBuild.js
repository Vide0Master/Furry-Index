const globalVariables = require("../systemServices/globalVariables")

exports.ROUTE = "/api/whatisthisbuild"

exports.WhatIsThisBuild = {
    m: "get",
    e: async (req, res) => {
        res.status(200).json({
            isDev: globalVariables.DEVmode,
            isEval: globalVariables.EVALmode,
            version: globalVariables.version
        })
    }
}