const cmd = require('./cmdPretty')
const prisma = require('./prisma')

const permanentTagsList = [
    { name: 'absurd_res' },
    { name: 'high_res' },
    { name: 'image', icon: 'image' },
    { name: 'animated' },
    { name: 'sound' },
    { name: 'short_playtime' },
    { name: 'long_playtime' },
    { name: 'absurd_playtime' },
]

module.exports = async () => {
    cmd.info('Upserting tags group "Meta" and adding system meta-tags', [cmd.preps.System, cmd.preps.DB])
    const tagGroup = await prisma.tagGroup.upsert({
        where: { basename: 'meta' },
        update: {
            name: { ENG: 'Meta' },
            locked: true,
            priority: -1
        },
        create: {
            basename: 'meta',
            name: { ENG: 'Meta' },
            locked: true,
            priority: -1
        }
    })

    await Promise.all(
        permanentTagsList.map(tag =>
            prisma.tag.upsert({
                where: { name: tag.name },
                update: {
                    groupname: tagGroup.basename,
                    icon: tag.icon ? tag.icon : undefined
                },
                create: {
                    name: tag.name,
                    groupname: tagGroup.basename,
                    icon: tag.icon ? tag.icon : undefined
                }
            })
        )
    )
}
