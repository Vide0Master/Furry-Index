const getUserBySessionCookie = require("../../systemServices/getUserBySessionCookie")
const { mainAuthTokenKey } = require('../../systemServices/globalVariables')
const prisma = require('../../systemServices/prisma')

exports.ROUTE = '/api/posts'

exports.GET = async (req, res) => {
    const user = await getUserBySessionCookie(req.cookies[mainAuthTokenKey] || null)

    const page = req.query.p ? parseInt(req.query.p) : 0
    const take = req.query.t ? parseInt(req.query.t) : 50
    const tagFilter = req.query.tags
        ? req.query.tags.split('+').map(tag => tag.trim())
        : []

    const processedTags = []

    for (let tag of tagFilter) {
        let negative = false

        if (tag.startsWith('-')) {
            negative = true
            tag = tag.slice(1)
        }

        switch (true) {
            case tag.startsWith('author:'): {
                const authorName = tag.split(':')[1]
                processedTags.push({ owner: { username: authorName } })
            }; break;
        }
    }

    const posts = await prisma.post.findMany({
        skip: page * take,
        take,
        where: {
            AND: [
                { visible: true },
                ...processedTags
            ]
        },
        include: {
            tags: {
                include: {
                    group: true
                },
                orderBy: {
                    name: 'desc'
                }
            },
            files: {
                select: {
                    id: true
                }
            }
        },
        orderBy: {
            createdOn: 'desc'
        }
    })

    return res.status(200).json({ posts })
}

exports.POST = async (req, res) => {
    const userToken = req.cookies[mainAuthTokenKey]
    if (!userToken) return res.status(401).send()
    const user = await getUserBySessionCookie(userToken)
    if (!user) return res.status(401).send()

    const postData = req.body
    if (!postData) res.status(400).send('No body provided!')

    const filesTags = await prisma.file.findMany({
        where: {
            OR: [...(postData.files.map((id) => { return { id } }))]
        },
        select: {
            tags: {
                select: {
                    name: true
                }
            }
        }
    })

    const postTags = postData.tags ? postData.tags.map(tagname => ({
        where: { name: tagname },
        create: { name: tagname }
    })) : []

    for (const file of filesTags) {
        for (const tag of file.tags) {
            const indx = postTags.indexOf(tag.name)

            if (indx == -1) {
                postTags.push({
                    where: { name: tag.name },
                    create: { name: tag.name }
                })
            }
        }
    }

    const newPost = await prisma.post.create({
        data: {
            name: postData.name,
            description: postData.description,
            type: postData.type,
            rating: postData.rating,
            files: {
                connect: postData.files.map((id) => { return { id } })
            },
            tags: { connectOrCreate: postTags },
            ownerid: user.id
        }
    })

    if (!newPost) res.send(500).send('Error creating post!')

    res.status(200).json({ postID: newPost.id })
}