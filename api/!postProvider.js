const constants = require('../systemServices/globalVariables')
const htmlImports = require('../systemServices/importBuilder')
const prisma = require('../systemServices/prisma')

exports.ROUTE = '/post/:postID'

exports.GET = async (req, res) => {

    const post = await prisma.post.findUnique({
        where: {
            id: req.params.postID
        },
        include: {
            files: true
        }
    })

    let page =
        `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Furry Index</title>
<meta name="description" content="The all-catching art community.">
<meta property="og:locale" content="en" />
<meta property="og:site_name" content="Furry index" />`


    if (post) {
        page +=
`\n<meta property="og:type" content="website" />
<meta property="og:title" content="${post.name}" />
${post.description ? `<meta property="og:description" content="${post.description}" />` : ''}
<meta property="og:image" content="https://${constants.serverLink}/api/posts/${post.id}/file/${post.files[0].fileid}?thumbnail=600" />
<meta property="og:url" content="https://${constants.serverLink}/posts/${post.id}" />`
    }
    //${req.query.bypass == 'true' ? '&bypass=true' : ''}
    
    page +=`\n<link rel="canonical" href="https://${constants.serverLink}">
<link rel="icon" href="https://${constants.serverLink}/icon.png">
<link rel="apple-touch-icon" href="https://${constants.serverLink}/icon.png">
${htmlImports()}
</head>
<body class="theme-default">
</body>
</html>`
    res.send(page)
}