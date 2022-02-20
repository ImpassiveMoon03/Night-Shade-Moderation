const Discord = require('discord.js')
module.exports = {
    name: 'lock',
    permission: 'staff',
    command: {
        name: 'lock',
        description: 'Prevent a channel from being talked in',
        defaultPermission: false,
        options: [
            {
                name: 'channel',
                type: 'CHANNEL',
                description: 'The channel to be locked',
                required: true
            },
            {
                name: 'reason',
                type: 'STRING',
                description: 'The reason for locking the channel',
                required: false
            }
        ]
    },
    async execute(interaction = new Discord.CommandInteraction(), bot){
        let channel = interaction.options.get('channel').channel
        let reason = interaction.options.get('reason')
        if(!reason) reason = "No Reason Specified"
        else reason = reason.value
        channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {SEND_MESSAGES: false}).then(() => {
            interaction.reply({
                content: `${channel.name} has been locked!`,
                ephemeral: true
            })
            channel.send({
                embeds: [
                    new Discord.MessageEmbed()
                    .setTitle('Channel Has Been Locked For The Following Reason:')
                    .setDescription("```"+reason+"```")
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