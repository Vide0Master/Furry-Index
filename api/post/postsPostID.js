const getUserBySessionCookie = require("../../systemServices/getUserBySessionCookie")
const { mainAuthTokenKey } = require('../../systemServices/globalVariables')
const prisma = require('../../systemServices/prisma')

exports.ROUTE = '/api/posts/:postID'

exports.GET = async (req, res) => {
    const user = await getUserBySessionCookie(req.cookies[mainAuthTokenKey] || null)

    const postID = req.params.postID

    const post = await prisma.post.findUnique({
        where: {
            id: postID
        },
        include: {
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
            owner: {
                select: {
                    username: true,
                    visiblename: true,
                    avatarID: true
                }
            }
        }
    })

    if (!post.visible && user?.id != post.ownerid) return res.status(403).send('Post is not available')

    for (const tag of post.tags) {
        tag.count = tag._count.posts;
        delete tag._count
    }

    res.status(200).json({ post })
}

exports.PUT = async (req, res) => {
    const user = await getUserBySessionCookie(req.cookies[mainAuthTokenKey] || null);
    if (!user) return res.status(401).send();

    const postID = req.params.postID;
    if (!postID) return res.status(400).send('No postID in route');
    if (!req.body) return res.status(400).send('No body request');

    const restricted = ['id', 'ownerid', 'owner', 'createdOn'];
    if (Object.keys(req.body).some(key => restricted.includes(key))) {
        return res.status(403).send('Cant edit restricted fields');
    }

    const updateData = {};

    if (req.body.files) {
        updateData.files = {
            set: req.body.files.map(id => ({ id }))
        };
    }

    if (req.body.tags) {
        let postTagsMap = new Map();
        for (const name of req.body.tags) {
            postTagsMap.set(name, { where: { name }, create: { name } });
        }

        if (req.body.files && req.body.files.length) {
            const filesTags = await prisma.file.findMany({
                where: { id: { in: req.body.files } },
                select: {
                    tags: { select: { name: true } },
                    id: true
                }
            });
            for (const file of filesTags) {
                updateFileLastActivity(file.id)
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
        where: { id: postID },
        select: {
            files: true
        }
    })

    for(const file of postData.files){
        updateFileLastActivity(file.id)
    }

    const rm = await prisma.post.deleteMany({
        where: {
            id: postID,
            ownerid: user.id
        }
    })

    if (rm.count == 0) return res.status(403).send('Removal denied')

    return res.status(200).send('Post removed successfully')
}