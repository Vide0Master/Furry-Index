const prisma = require('../../systemServices/prisma')
const bcrypt = require('bcrypt');

exports.ROUTE = "/api/register";

exports.POST = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || typeof username !== 'string') {
            return res.status(400).json({ error: 'Username is required and must be a string' });
        }
        if (!password || typeof password !== 'string') {
            return res.status(400).json({ error: 'Password is required and must be a string' });
        }

        const existingUser = await prisma.user.findUnique({
            where: { username }
        });

        if (existingUser) {
            return res.status(409).json({ error: 'Username already taken' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
            }
        });

        return res.status(201).json({ user: newUser });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.GET = async (req, res) => {
    const user = await prisma.user.findUnique({
        where: {
            username: req.query.username
        }
    })

    if (user) {
        return res.status(200).json({ taken: true })
    } else {
        return res.status(200).json({ taken: false })
    }
}