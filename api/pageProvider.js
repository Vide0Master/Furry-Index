const htmlImports = require('../systemServices/importBuilder')

exports.ROUTE = /^(?!\/api(?:\/|$)).*/

exports.GET = (req, res) => {
    let page =
`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Furry Index</title>
<meta name="description" content="The all-catching art community.">
<link rel="canonical" href="https://furry-index.vmtech.services/">
<link rel="icon" href="/icon.png">
<link rel="apple-touch-icon" href="/icon.png">
${htmlImports()}
</head>
<body class="theme-default">
</body>
</html>`
    res.send(page)
}