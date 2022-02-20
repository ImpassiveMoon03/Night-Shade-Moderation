const Discord = require('discord.js')
module.exports = {
    name: 'command-list',
    permission: 'staff',
    command: {
        name: 'command-list',
        description: 'Get a list of all slash commands',
        defaultPermission: false
    },
    async execute(interaction, bot){
        let cmdlist = []
        bot.commands.forEach(c => {
            cmdlist.push(c.name)
        })
        interaction.reply({
            embeds: [
                new Discord.MessageEmbed()
                .setTitle('All slash commands')
                .setColor(process.env.THEME)
                .setDescription(cmdlist.join('\n'))
            ],
            ephemeral: true
        })
    }
}