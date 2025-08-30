const { updateFileLastActivity } = require("../../systemServices/DBFunctions")
const getUserBySessionCookie = require("../../systemServices/getUserBySessionCookie")
const { mainAuthTokenKey } = require('../../systemServices/globalVariables')
const prisma = require('../../systemServices/prisma')

exports.ROUTE = '/api/posts/:postID'

exports.GET = async (req, res) => {
    const user = await getUserBySessionCookie(req.cookies[mainAuthTokenKey] || null)

    const postID = req.params.postID

    const include = {
        files: {
            select: {
                id: true,
                fileparams: true
            }
        },
        tags: {
            select: {
                name: true,
                icon: true,
                group: {
                    select: {
                        basename: true,
                        name: true,
                        color: true,
                        priority: true,
                    }
                },
                _count: true
            }
        },
        favourites: {
            select: {
                userid: true
            }
        },
        owner: {
            select: {
                username: true,
                visiblename: true,
                avatarID: true
            }
        }
    }

    if (user) {
        include.scores = { where: { userid: user.id } }
    }

    const post = await prisma.post.findUnique({
        where: {
            id: postID
        },
        include,
    })

    if (!post.visible && user?.id != post.ownerid) return res.status(403).send('Post is not available')

    for (const tag of post.tags) {
        tag.count = tag._count.posts;
        delete tag._count
    }

    if (post.scores) {
        post.ownscore = post.scores[0]?.type || 'none'
        delete post.scores
    }


    if (user && post.favourites.some(v => v.userid == user.id)) post.myfav = true

    if (post.favourites) post.favourites = post.favourites.length

    res.status(200).json({ post })
}

exports.PUT = async (req, res) => {
    const user = await getUserBySessionCookie(req.cookies[mainAuthTokenKey] || null);
    if (!user) return res.status(401).send();

    const postID = req.params.postID;
    if (!postID) return res.status(400).send('No postID in route');
    if (!req.body) return res.status(400).send('No body request');

    const post = await prisma.post.findUnique({
        where: { id: postID },
        include: { files: { select: { id: true } } }
    })

    if (!post) return res.status(404).send('Post not found')

    const restricted = ['id', 'ownerid', 'owner', 'createdOn'];
    if (Object.keys(req.body).some(key => restricted.includes(key))) {
        return res.status(403).send('Cant edit restricted fields');
    }

    const updateData = {};

    if (req.body.files) {
        for (const file of post.files) {
            updateFileLastActivity(file.id)
        }

        for (const fileID of req.body.files) {
            updateFileLastActivity(fileID)
        }

        updateData.files = {
            set: req.body.files.map(id => ({ id }))
        };
    }

    if (req.body.tags) {
        let postTagsMap = new Map();
        for (const name of req.body.tags) {
            postTagsMap.set(name, { where: { name: name.toLowerCase() }, create: { name: name.toLowerCase() } });
        }

        if (req.body.files && req.body.files.length) {
            const filesTags = await prisma.file.findMany({
                where: { id: { in: req.body.files } },
                select: {
                    tags: { select: { name: true } }
                }
            });
            for (const file of filesTags) {
                for (const { name } of file.tags) {
                    if (!postTagsMap.has(name)) {
                        postTagsMap.set(name, { where: { name }, create: { name } });
                    }
                }
            }
        }

        updateData.tags = {
            set: [],
            connectOrCreate: Array.from(postTagsMap.values())
        };
    }

    for (const key of Object.keys(req.body)) {
        if (key !== 'files' && key !== 'tags') {
            updateData[key] = req.body[key];
        }
    }

    try {
        await prisma.post.update({
            where: {
                id: postID,
                ownerid: user.id
            },
            data: updateData
        });
        return res.status(200).json({ updated: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ updated: false });
    }
};

exports.DELETE = async (req, res) => {
    const user = await getUserBySessionCookie(req.cookies[mainAuthTokenKey] || null)
    if (!user) return res.status(401).send()

    const postID = req.params.postID

    if (!postID) return res.status(400).send('No postID in route')

    const postData = await prisma.post.findUnique({
        where: {
            id: postID
        },
        include: { files: { select: { id: true } } }
    })

    if (!postData) return res.status(404).send('Post not found')

    if (postData.ownerid != user.id) return res.status(403).send('You are not allowed to edit this post')

    const rm = await prisma.post.deleteMany({
        where: {
            id: postID,
            ownerid: user.id
        }
    })

    if (rm.count == 0) return res.status(500).send('Rm error')

    postData.files.forEach(file => {
        updateFileLastActivity(file.id)
    })

    return res.status(200).send('Post removed successfully')
}
