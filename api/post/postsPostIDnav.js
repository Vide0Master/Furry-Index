const prisma = require('../../systemServices/prisma')
const getUserBySessionCookie = require("../../systemServices/getUserBySessionCookie")
const { mainAuthTokenKey } = require('../../systemServices/globalVariables')

exports.ROUTE = '/api/posts/:postID/navigation'

exports.GET = async (req, res) => {
    const user = await getUserBySessionCookie(req.cookies[mainAuthTokenKey] || null);
    const postID = req.params.postID

    const current = await prisma.post.findUnique({
        where: { id: postID },
        select: { createdOn: true }
    })

    if (!current) return res.status(404).json({ error: "Post not found" })

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
            if (filterHandlers[field]) processedFilters.push(filterHandlers[field](value, negative));
            continue;
        }

        if (negative) negativeTagNames.push(tag)
        else positiveTagNames.push(tag)
    }

    if (positiveTagNames.length) {
        processedFilters.push({ AND: positiveTagNames.map(v => ({ tags: { some: { name: v } } })) });
    }
    if (negativeTagNames.length) {
        processedFilters.push({ NOT: { tags: { some: { name: { in: negativeTagNames } } } } });
    }

    const visibility = { OR: [{ visible: true }] };
    if (user) visibility.OR.push({ ownerid: user.id })

    const where = { AND: [visibility, ...processedFilters] }

    const [next, prev] = await Promise.all([
        prisma.post.findFirst({
            where: { ...where, createdOn: { lt: current.createdOn } },
            orderBy: [{ createdOn: 'desc' }, { id: 'desc' }],
            select: { id: true }
        }),
        prisma.post.findFirst({
            where: { ...where, createdOn: { gt: current.createdOn } },
            orderBy: [{ createdOn: 'asc' }, { id: 'asc' }],
            select: { id: true }
        })
    ]);

    res.status(200).json({ prev: prev?.id, next: next?.id })
}