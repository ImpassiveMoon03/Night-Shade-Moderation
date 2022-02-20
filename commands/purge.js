const Discord = require('discord.js')

module.exports = {
    name: 'purge',
    permission: 'staff',
    command: {
        name: 'purge',
        description: 'Delete a certain number of messages from the channel',
        defaultPermission: false,
        options: [
            {
                name: 'number',
                type: 'NUMBER',
                required: true,
                description: 'The number of messages to delete'
            }
        ]
    },
    async execute(interaction, bot){
        let number = interaction.options.get('number').value
        interaction.channel.bulkDelete(number).then(c => {
            interaction.reply({
                embeds: [
                    new Discord.MessageEmbed()
                    .setTitle(`Deleted ${number} Messages`)
                    .setColor(0xb00b1e)
                    .setDescription('Successfully Executed Command!')
                ],
                ephemeral: true
            })
        }).catch(err => {
            interaction.reply({
                content: `An error has occured:\n\`\`\`${err}\`\`\``,
                ephemeral: true
            })
        })
    }
}