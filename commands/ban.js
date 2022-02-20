const Discord = require('discord.js')
const fs = require('fs')
module.exports = {
    name: 'ban',
    permission: 'admin',
    command: {
        name: 'ban',
        description: 'Ban a member from the server!',
        options: [
            {
                name: 'user',
                description: 'The user getting banned',
                type: "USER",
                required: true
            },
            {
                name: 'time',
                description: 'The amount of days for a temp ban',
                type: 'NUMBER',
                required: false,
                choices: [
                    {name: 1, value: 1},
                    {name: 2, value: 2},
                    {name: 3, value: 3},
                    {name: 4, value: 4},
                    {name: 5, value: 5},
                    {name: 6, value: 6},
                    {name: 7, value: 7}
                ]
            },
            {
                name: 'reason',
                description: 'The reason for such a cruel and unusual punishment',
                type: 'STRING',
                required: false
            }
        ],
        defaultPermission: false
    },
    async execute(interaction, bot){
        let db = require('../data.json')
        let member = interaction.guild.members.cache.get(interaction.options.get('user').user.id);
        let user = db[member.id]
        if(!member){
            db[member.id] = {
                warns: [],
                mutes: [],
                kicks: [],
                bans: []
            }
            user = db[member.id]
        }
        let reason = interaction.options.get('reason')
        if(!reason) reason = "No Reason Given"
        else reason = reason.value
        let data = {
            reason: reason,
            moderator: interaction.user.id,
            timestamp: Date.now()
        }
        db[member.id].bans.push(data)
        fs.writeFileSync('./data.json', JSON.stringify(db))
        let time = interaction.options.get('time')
        if(time){
            time = time.value
            member.ban({days: time, reason: reason}).then(m => {
                interaction.reply({
                    embeds: [
                        new Discord.MessageEmbed()
                        .setTitle(`${member.user.username} Banned!`)
                        .setColor("#b00b1e")
                        .setDescription(`Reason:\n\`\`\`${reason}\`\`\`\nTime:\n\`\`\`${time} Days\`\`\``)
                        .addField('Ban Number', `${db[member.id].bans.length}`)
                    ],
                    ephemeral: true
                })
            }).catch(err => {
                interaction.reply({
                    content: `An error has occured:\n\`\`\`${err}\`\`\``,
                    ephemeral: true
                })
            })
        }else{
            member.ban({reason: reason}).then(m => {
                interaction.reply({
                    embeds: [
                        new Discord.MessageEmbed()
                        .setTitle(`${member.user.username} Banned!`)
                        .setColor("#b00b1e")
                        .setDescription(`Reason:\n\`\`\`${reason}\`\`\``)
                        .addField('Ban Number', `${db[member.id].bans.length}`)
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
}