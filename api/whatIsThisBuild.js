const globalVariables = require('../systemServices/globalVariables')

exports.ROUTE = '/api/whatisthisbuild'

exports.GET = async (req, res) => {
    res.status(200).json({
        isDev: globalVariables.DEVmode,
        isEval: globalVariables.EVALmode,
        version: globalVariables.version
    })
}