const Discord = require('discord.js')
const fs = require('fs')
module.exports = {
    name: 'commands',
    permission: 'me',
    command: {
        name: 'commands',
        description: 'Load all of the bot slash commands',
        defaultPermission: false
    },
    async execute(interaction = new Discord.CommandInteraction(), bot, guild, perms){
        await interaction.deferReply({
            ephemeral: true
        }).then(async () => {
            let cmdfolder = fs.readdirSync('./commands').filter(f => f.endsWith('.js'))
            for(var i = 0; i<cmdfolder.length;i++){
                let file = require(`./${cmdfolder[i]}`)
                bot.commands.set(file.name, file)
                let command = await guild.commands.create(file.command)
                if(file.permission == 'staff'){
                    await command.permissions.set({permissions: perms.staff})
                }else if(file.permission == 'admin'){
                    await command.permissions.set({permissions: perms.admin})
                }else if(file.permission == 'me'){
                    await command.permissions.set({permissions: perms.me})
                }
            }
            await interaction.editReply({
                content: 'Commands Loaded!',
                ephemeral: true
            })
        })
    }
}