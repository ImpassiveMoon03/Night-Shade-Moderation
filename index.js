require('dotenv').config()
const Discord = require('discord.js')
const fs = require('fs')
const bot = new Discord.Client({
    intents: new Discord.Intents(4915),
    partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER', 'GUILD_MEMBER']
})
bot.commands = new Discord.Collection()
function isJSON(string = ""){
    try{
        JSON.parse(string)
    }catch(err){
        return false
    }
    return true
}

const commandFolder = fs.readdirSync('./commands').filter(f => f.endsWith('.js'))
for(var i = 0; i<commandFolder.length; i++){
    let file = require(`./commands/${commandFolder[i]}`)
    bot.commands.set(file.name, file)
}
const perms = {
    admin: [
        {
            id: process.env.ADMIN, 
            type: "ROLE", 
            permission: true
        },
    ],
    staff: [
        {
            id: process.env.STAFF,
            type: 'ROLE',
            permission: true
        }
    ],
    me: [
        {
            id: '558800844343214090',
            type: 'USER',
            permission: true
        }
    ]
}

bot.on('ready', async () => {
    console.log('ready')

    let db = require('./data.json')
    bot.users.cache.forEach(u => {
        if(!db[u.id]){
            console.log(u.username+" Being Added to the Database!")
            db[u.id] = {
                warns: [],
                mutes: [],
                kicks: [],
                bans: []
            }
        }
    })
    fs.writeFileSync('./data.json', JSON.stringify(db))
    console.log('Database Write Complete!')

    bot.user.setActivity({
        type: "WATCHING",
        name: 'DM For Modmail'
    })
})

bot.on('interactionCreate', async (interaction) => {
    let guild = bot.guilds.cache.get(process.env.GUILD)
    if(interaction.isCommand()){
        await bot.commands.forEach(async c => {
            if(c.name === interaction.commandName){
                return await c.execute(interaction, bot, guild, perms)
            }
        })
    }else if(interaction.isButton()){
        if(interaction.customId.startsWith('role-')){
            let role = interaction.guild.roles.cache.get(interaction.customId.split('-')[1])
            if(interaction.member.roles.cache.has(role.id)){
                interaction.member.roles.remove(role).then(() => {
                    interaction.reply({
                        content: `You have been removed from the role ${role.name}`,
                        ephemeral: true
                    })
                }).catch(err => {
                    interaction.reply({
                        content: `There was an error with removing your role:\n\`\`\`${err}\`\`\``,
                        ephemeral: true
                    })
                })
            }else{
                interaction.member.roles.add(role).then(() => {
                    interaction.reply({
                        content: `You have been given the role ${role.name}`,
                        ephemeral: true
                    })
                }).catch(err => {
                    interaction.reply({
                        content: `There was an error with giving you your role:\n\`\`\`${err}\`\`\``,
                        ephemeral: true
                    })
                })
            }
        }
    }
})

bot.on('messageCreate', async message => {
    if(message.author.bot) return;
    if(message.channel.type == 'DM'){
        let channel = bot.channels.cache.get(process.env.MODMAIL)
        channel.send({
            embeds: [
                new Discord.MessageEmbed()
                .setTitle(`Message from ${message.author.username}`)
                .setDescription(message.content)
                .setColor(process.env.THEME)
            ]
        })
        message.channel.send({
            content: 'Your message was sent!'
        })
    }
    if(!message.member) return
    if(!message.member.roles.cache.has(process.env.STAFF)) return
    if(!message.content.toLowerCase().startsWith('ns')) return

    if(message.content.toLowerCase().startsWith('nsembed')){
        let c = message.content.split('```')
        if(!c.length >= 2) return message.channel.send('This command requires a code block!')
        let content = c[1]
        if(!content) return message.channel.send('This command requires a code block')
        if(content.toLowerCase().startsWith('json')){
            content = content.split('\n').slice(1).join('\n')
            if(!isJSON(content)){
                return message.channel.send("Invalid JSON data")
            }else{
                let embedData = JSON.parse(content)

                let name = embedData.name || message.author.username
                let avatar = embedData.avatar || message.author.avatarURL()
                let webhook = message.channel.createWebhook(name, {avatar: avatar}).then(hook => {
                    let embed = new Discord.MessageEmbed()
                    if(!embedData.description) return message.channel.send('Your embed must have a description!')
                    embed.setDescription(embedData.description)
                    if(embedData.title) embed.setTitle(embedData.title)
                    if(embedData.footer && typeof(embedData.footer) == 'object'){
                        if(embedData.footer.text && embedData.footer.icon) embed.setFooter(embedData.footer.text, embedData.footer.icon) 
                        else if(embedData.footer.text) embed.setFooter(embedData.footer.text)
                    }
                    if(embedData.color) embed.setColor(embedData.color)
                    if(embedData.image) embed.setImage(embedData.image)
                    if(embedData.url) embed.setURL(embedData.url)
                    if(embedData.thumbnail) embed.setThumbnail(embedData.thumbnail)

                    if(embedData.author && typeof(embedData.author) == 'object'){
                        if(embedData.author.username && embedData.author.avatar) embed.setAuthor(embedData.author.username, embedData.author.avatar)
                    }

                    if(embedData.fields && typeof(embedData.fields) == 'object' && Array.isArray(embedData.fields)){
                        if(embedData.fields.length > 25) return message.channel.send('Your embed must have less than or equal to 25 fields')
                        else{
                            for(var i = 0; i<embedData.fields.length; i++){
                                let fieldData = embedData.fields[i]
                                if(!fieldData.name) return message.channel.send(`Embed field ${i+1} is missing a name`)
                                if(!fieldData.value) return message.channel.send(`Embed field ${i+1} is missing a value`)
                                let inline = fieldData.inline || false

                                embed.addField(fieldData.name, fieldData.value, inline)
                            }
                        }
                    }

                    message.delete()
                    if(!embedData.content){
                        hook.send({
                            embeds: [embed]
                        }).then(h => hook.delete().catch(err => {
                            message.channel.send('There was an error deleting the webhook, please delete it manually!\n```'+err+'```')
                        }))
                    }else{
                        hook.send({
                            embeds: [embed],
                            content: embedData.content
                        }).then(h => hook.delete().catch(err => {
                            message.channel.send('There was an error deleting the webhook, please delete it manually!\n```'+err+'```')
                        }))
                    }
                }).catch(err => {
                    message.channel.send(`An Error Has Occured\n\`\`\`${err}\`\`\``)
                })
            }
        }else{
            return message.channel.send('Please define your code block as JSON!')
        }
    }
})

bot.login(process.env.TOKEN)