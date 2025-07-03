const constants = require('../systemServices/globalVariables')
const htmlImports = require('../systemServices/importBuilder')

exports.ROUTE = /^(?!\/api(?:\/|$)).*/

exports.GET = (req, res) => {
    const page =
`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Furry Index</title>
<meta name="description" content="The all-catching art community.">
<meta property="og:locale" content="en" />
<meta property="og:site_name" content="Furry index" />
<link rel="canonical" href="https://${constants.serverLink}">
<link rel="icon" href="https://${constants.serverLink}/icon.png">
<link rel="apple-touch-icon" href="https://${constants.serverLink}/icon.png">
${htmlImports()}
</head>
<body class="theme-default">
</body>
</html>`
    res.send(page)
}