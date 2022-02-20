const Discord = require('discord.js')
const fs = require('fs')
const rules = {
    '1': 'No Advertisements',
    '2': 'No NSFW/Disturbing Content',
    '3': 'No Spam',
    '4': 'No Excessive Conversating on Sensitive Topics',
    '5': 'Be Respectful',
    '6': 'Each Player Get\'s One Entry in Each Giveaway',
    '7': 'Do Not Ping The Admins',
    '8': 'No Begging',
    '9': 'Use Channels For Their Propper Reasons'
}
module.exports = {
    name: 'warn',
    permission: 'staff',
    command: {
        name: 'warn',
        description: 'Warn a member for their bad behaviour',
        defaultPermission: false,
        options: [
            {
                name: 'user',
                type: 'USER',
                description: "The user performing the bad behaviour",
                required: true,
            },
            {
                name: 'reason',
                type: "STRING",
                description: 'The reason for the warn',
                required: true
            },
            {
                name: 'rule',
                type: 'NUMBER',
                description: 'The rule number broke',
                required: false,
                choices: [
                    {name: 1, value: 1},
                    {name: 2, value: 2},
                    {name: 3, value: 3},
                    {name: 4, value: 4},
                    {name: 5, value: 5},
                    {name: 6, value: 6},
                    {name: 7, value: 7},
                    {name: 8, value: 8},
                    {name: 9, value: 9}
                ]
            },
            {
                name: 'message',
                type: 'NUMBER',
                description: 'The ID of a message',
                required: false
            }
        ]
    },
    async execute(interaction, bot){
        let db = require('../data.json')
        let member = interaction.guild.members.cache.get(interaction.options.get('user').user.id);
        if(!db[member.id]){
            db[member.id] = {
                warns: [],
                mutes: [],
                kicks: [],
                bans: []
            }
        }
        let reason = interaction.options.get('reason').value
        let data = {
            reason: reason,
            moderator: interaction.user.id,
            timestamp: Date.now()
        }
        db[member.id].warns.push(data)
        let embed = new Discord.MessageEmbed()
        .setTitle(`Warning from ${interaction.user.username}`)
        .setColor("#b00b1e")
        .setDescription(`Reason:\n\`\`\`${reason}\`\`\``)
        let rule = interaction.options.get('rule')
        if(rule){
            embed.addField('Rule Broken', rules[rule.value])
        }
        let message = interaction.options.get('message')
        if(message){
            embed.addField('Message', message.value)
        }
        embed.addField("Total Warnings", `${db[member.id].warns.length}`)
        fs.writeFileSync('./data.json', JSON.stringify(db))
        member.send({
            embeds: [embed]
        })
        interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
    }
}