const Discord = require('discord.js')
function toDate(ms){
    let d = new Date(ms)
    return `${d.getMonth()+1}/${d.getDate()}/${d.getFullYear()}`
}
module.exports = {
    name: 'warnings',
    permission: 'staff',
    command: {
        name: 'warnings',
        description: 'View the warnings of a member',
        defaultPermission: false,
        options: [
            {
                name: 'user',
                required: true,
                description: 'The user you are looking up',
                type: 'USER'
            }
        ]
    },
    async execute(interaction, bot){
        let member = interaction.options.get('user').user
        let db = require('../data.json')
        if(!db[member.id]){
            interaction.reply({
                content: `${member.username} has no warnings!`,
                ephemeral: true
            })
        }else{
            let warnings = db[member.id].warns
            if(warnings.length == 0){
                interaction.reply({
                    content: `${member.username} has no warnings!`,
                    ephemeral: true
                })
            }else{
                let embed = new Discord.MessageEmbed()
                .setTitle(`${member.username}'s Warnings`)
                .setColor(0xb00b1e)
                .setDescription(`${warnings.length} total warnings`)
                for(var i = 0; i<warnings.length; i++){
                    if(i < 24){
                        embed.addField(
                            `By ${interaction.guild.members.cache.get(warnings[i].moderator).user.username} on ${toDate(warnings[i].timestamp)}`,
                            `${warnings[i].reason}`
                        )
                    }
                }
                interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                })
            }
        }
    }
}