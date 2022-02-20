const Discord = require('discord.js')
module.exports = {
    name: 'dm',
    permission: 'staff',
    command: {
        name: 'dm',
        description: 'Send a user a direct message',
        defaultPermission: false,
        options: [
            {
                name: 'user',
                type: 'USER',
                required: true,
                description: 'The user you want to message'
            },
            {
                name: 'message',
                type: 'STRING',
                required: true,
                description: 'The message you want to send'
            }
        ]
    },
    async execute(interaction, bot){
        let member = interaction.guild.members.cache.get(interaction.options.get('user').user.id)
        let message = interaction.options.get('message').value
        member.send({
            embeds: [
                new Discord.MessageEmbed()
                .setTitle(`Message from ${interaction.user.username}`)
                .setDescription(message)
                .setColor(process.env.THEME)
            ]
        }).then(() => {
            interaction.reply({
                content: 'Message Sent!',
                ephemeral: true
            })
        }).catch(err => {
            interaction.reply({
                content: `An error has occured:\n\`\`\`${err}\`\`\``
            })
        })
    }
}