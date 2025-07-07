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
                        }
                    }
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

    let fileIds = [];
    if (req.body.files) {
        fileIds = req.body.files;
        req.body.files = {
            set: fileIds.map(id => ({ id }))
        };
    }

    let postTagsMap = new Map();
    if (req.body.tags) {
        for (const name of req.body.tags) {
            postTagsMap.set(name, { where: { name }, create: { name } });
        }
    }

    if (fileIds.length) {
        const filesTags = await prisma.file.findMany({
            where: { id: { in: fileIds } },
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

    req.body.tags = {
        set: [],
        connectOrCreate: Array.from(postTagsMap.values())
    };

    try {
        await prisma.post.update({
            where: {
                id: postID,
                ownerid: user.id
            },
            data: {
                ...req.body
            }
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


    const rm = await prisma.post.deleteMany({
        where: {
            id: postID,
            ownerid: user.id
        }
    })

    if (rm.count == 0) return res.status(403).send('Removal denied')

    return res.status(200).send('Post removed successfully')
}