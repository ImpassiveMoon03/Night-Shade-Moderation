const Discord = require('discord.js')

module.exports = {
    name: 'announce',
    permission: 'staff',
    command: {
        name: 'announce',
        description: 'Send a message to another channel',
        defaultPermission: false,
        options: [
            {
                name: 'channel',
                type: 'CHANNEL',
                description: 'The channel to send the message to',
                required: true
            },
            {
                name: 'message',
                type: "STRING",
                description: 'The message to send to the other channel',
                required: true
            },
            {
                name: 'mention',
                type: 'ROLE',
                description: 'The role to mention with the message',
                required: false
            }
        ]
    },
    async execute(interaction, bot){
        let channel = interaction.options.get('channel').channel
        let message = interaction.options.get('message').value
        let role = interaction.options.get('mention')
        if(role){
            message = `${role.role}` + " " + message
        }
        channel.send({
            content: message
        }).then(m => {
            interaction.reply({
                embeds: [
                    new Discord.MessageEmbed()
                    .setDescription("Message Sent!")
                    .setColor(process.env.THEME)
                ],
                ephemeral: true
            })
        }).catch(err => {
            interaction.reply({
                content: `An error has occured:\n\`\`\`${err}\`\`\``
            })
        })
    }
}