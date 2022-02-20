const Discord = require('discord.js')
module.exports = {
    name: 'unlock',
    permission: 'staff',
    command: {
        name: 'unlock',
        description: 'Unlock a channel',
        defaultPermission: false,
        options: [
            {
                name: 'channel',
                type: 'CHANNEL',
                description: 'The channel to be unlocked',
                required: true
            }
        ]
    },
    async execute(interaction = new Discord.CommandInteraction(), bot){
        let channel = interaction.options.get('channel').channel
        channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {SEND_MESSAGES: true}).then(() => {
            interaction.reply({
                content: `${channel.name} has been unlocked!`,
                ephemeral: true
            })
            channel.send({
                embeds: [
                    new Discord.MessageEmbed()
                    .setDescription("Channel Unlocked")
                    .setColor(process.env.THEME)
                ]
            })
        }).catch(err => {
            interaction.reply({
                content: `An error has occured:\n\`\`\`${err}\`\`\``,
                ephemeral: true
            })
        })
    }
}