const getUserBySessionCookie = require("../../systemServices/getUserBySessionCookie")
const { mainAuthTokenKey } = require('../../systemServices/globalVariables')
const prisma = require('../../systemServices/prisma')
const path = require('path')
const removeFile = require("../../systemServices/removeFile")

exports.ROUTE = '/file/:fileID'

exports.DELETE = async (req, res) => {
    const userToken = req.cookies[mainAuthTokenKey]
    if (!userToken) return res.status(401).send('No cookie?')

    const user = await getUserBySessionCookie(userToken)
    if (!user) return res.status(401).send('No auth?')

    const fileID = req.params.fileID
    if (!fileID) return res.status(400).send('No fileID provided')

    const file = await prisma.file.findUnique({
        where: {
            fileid: fileID
        },
        include: {
            owner: {
                select: {
                    id: true
                }
            }
        }
    })

    if (!file) return res.status(400).send('File record was not found')

    if (file.owner.id != user.id) return res.status(403).send('You don\'t have permission to remove this file')

    const fileRemovalResult = await removeFile(path.join(__dirname, `../../file_storage/${file.file}`))
    
    if (!fileRemovalResult && !req.query.force=='true') return res.status(500).send('File removal error!')

    const DBRemove = await prisma.file.delete({
        where: {
            fileid: fileID
        }
    })

    if (!DBRemove) res.status(500).send('Erorr removing file record from database!')

    res.status(200).send('File removed')
}
