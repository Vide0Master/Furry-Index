const { updateFileLastActivity } = require("../../systemServices/DBFunctions");
const getUserBySessionCookie = require("../../systemServices/getUserBySessionCookie")
const { mainAuthTokenKey } = require('../../systemServices/globalVariables')
const prisma = require('../../systemServices/prisma')

exports.ROUTE = '/api/posts'

exports.GET = async (req, res) => {
    const user = await getUserBySessionCookie(req.cookies[mainAuthTokenKey] || null);

    const page = req.query.p ? parseInt(req.query.p) : 0;
    const take = req.query.t ? parseInt(req.query.t) : 50;
    const tagFilter = req.query.tags
        ? req.query.tags.split(' ').map(tag => tag.trim()).filter(Boolean)
        : [];

    const filterHandlers = {
        'author': (value, negative) => {
            const clause = { owner: { username: value } };
            return negative ? { NOT: clause } : clause;
        },
        'id': (value, negative) => {
            const clause = { OR: value.split(',').map(v => ({ id: v })) };
            return negative ? { NOT: clause } : clause;
        },
        'fav': (value, negative) => {
            let clause = {}
            if (value != 'server' || !user) {
                clause = { favourites: { some: { user: { username: value } } } };
            } else {
                clause = { favourites: { some: { userid: user.id } } };
            }
            return negative ? { NOT: clause } : clause;
        }
    };

    const positiveTagNames = [];
    const negativeTagNames = [];
    const processedFilters = [];

    for (let rawTag of tagFilter) {
        let negative = false;
        let tag = rawTag;

        if (tag.startsWith('-')) {
            negative = true;
            tag = tag.slice(1);
        }

        const fieldMatch = tag.match(/^([a-zA-Z]+):(.+)$/);
        if (fieldMatch) {
            const [, field, value] = fieldMatch;
            if (filterHandlers[field]) {
                processedFilters.push(filterHandlers[field](value, negative));
            }
            continue;
        }

        if (negative) {
            negativeTagNames.push(tag);
        } else {
            positiveTagNames.push(tag);
        }
    }

    if (positiveTagNames.length > 0) {
        processedFilters.push({
            tags: {
                some: {
                    name: { in: positiveTagNames }
                }
            }
        });
    }
    if (negativeTagNames.length > 0) {
        processedFilters.push({
            NOT: {
                tags: {
                    some: {
                        name: { in: negativeTagNames }
                    }
                }
            }
        });
    }
    const visibility = { OR: [{ visible: true }] }

    if (user) visibility.OR.push({ ownerid: user.id })

    const where = {
        AND: [
            visibility,
            ...processedFilters
        ]
    };

    if (req.query.count === 'true') {
        const count = await prisma.post.count({ where });
        return res.status(200).json({ count });
    }

    const include = {
        tags: {
            include: { group: true, _count: true },
            orderBy: { name: 'desc' },
        },
        favourites: { select: { userid: true } },
        files: true,
    }

    if (user) {
        include.scores = { where: { userid: user.id } }
    }

    const posts = await prisma.post.findMany({
        skip: page * take,
        take,
        where,
        include,
        orderBy: {
            createdOn: 'desc'
        }
    });

    for (const post of posts) {
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
    }

    return res.status(200).json({ posts });
};

exports.POST = async (req, res) => {
    const userToken = req.cookies[mainAuthTokenKey]
    if (!userToken) return res.status(401).send()
    const user = await getUserBySessionCookie(userToken)
    if (!user) return res.status(401).send()

    const postData = req.body
    if (!postData) return res.status(400).send('No body provided!')

    const filesTags = await prisma.file.findMany({
        where: {
            OR: postData.files.map(id => ({ id }))
        },
        select: {
            tags: {
                select: { name: true }
            },
            id: true
        }
    })

    const inputTags = Array.isArray(postData.tags)
        ? postData.tags.map(tag => typeof tag === 'string' ? tag : tag?.name)
        : []

    let postTags = inputTags.map(tagname => ({
        where: { name: tagname },
        create: { name: tagname }
    }))

    for (const file of filesTags) {
        updateFileLastActivity(file.id)
        for (const tag of file.tags) {
            const exists = postTags.some(t => t.where.name === tag.name)
            if (!exists) {
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
                connect: postData.files.map(id => ({ id }))
            },
            tags: { connectOrCreate: postTags },
            ownerid: user.id
        }
    })

    if (!newPost) return res.status(500).send('Error creating post!')

    res.status(200).json({ postID: newPost.id })
}