const Discord = require('discord.js')
const fs = require('fs')
module.exports = {
    name: 'kick',
    permission: 'admin',
    command: {
        name: 'kick',
        description: 'Kick a user from the server!',
        options: [
            {
                name: 'user',
                type: 'USER',
                description: 'The user being removed from the server',
                required: true
            },
            {
                name: 'reason',
                type: 'STRING',
                description: 'The reason for the member kick',
                required: false
            }
        ],
        defaultPermission: false
    },
    async execute(interaction = new Discord.CommandInteraction, bot){
        let db = require('../data.json')
        let member = interaction.guild.members.cache.get(interaction.options.get('user').user.id);
        if(!member){
            db[member.id] = {
                warns: [],
                mutes: [],
                kicks: [],
                bans: []
            }
        }

        let reason = interaction.options.get('reason')
        if(!reason) reason =  "No Reason Given!"
        else reason = reason.value
        let data = {
            reason: reason,
            moderator: interaction.user.id,
            timestamp: Date.now()
        }
        db[member.id].kicks.push(data)
        fs.writeFileSync('./data.json', JSON.stringify(db))
        member.kick(reason).then((m) => {
            interaction.reply({
                embeds: [
                    new Discord.MessageEmbed()
                    .setTitle(`${member.user.username} Kicked`)
                    .setColor("#b00b1e")
                    .setDescription(`Reason:\n\`\`\`${reason}\`\`\``)
                    .addField("Kick Number", `${db[member.id].kicks.length}`)
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