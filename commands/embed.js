const Discord = require('discord.js')
function isJSON(string = ""){
    try{
        JSON.parse(string)
    }catch(err){
        return false
    }
    return true
}
module.exports = {
    name: 'embed',
    permission: 'staff',
    command: {
        name: 'embed',
        description: 'Make an embed using JSON data',
        defaultPermission: false,
        options: [
            {
                name: 'json',
                description: "The JSON data of the embed",
                required: true,
                type: "STRING"
            },
            {
                name: 'channel',
                description: 'The channel to make the webhook and send the embed to',
                required: false,
                type: "CHANNEL"
            },
            {
                name: 'avatar',
                description: 'The URL of the avatar to give the webhook(put guild for the server icon)',
                required: false,
                type: 'STRING'
            },
            {
                name: 'name',
                description: 'The name of the webhook the message will be sent through',
                required: false,
                type: 'STRING'
            },
            {
                name: 'content',
                description: 'The content to send along with the message',
                required: false,
                type: 'STRING'
            }
        ]
    },
    async execute(interaction, bot){
        let json = interaction.options.get('json').value
        if(!isJSON(json)){
            interaction.reply({
                content: 'Invalid JSON Data!',
                ephemeral: true
            })
        }else{
            let channel = interaction.options.get('channel')
            if(!channel) channel = interaction.channel
            else channel = channel.channel
            let name = interaction.options.get('name')
            if(!name) name = interaction.user.username
            else name = name.value
            let avatar = interaction.options.get('avatar')
            if(!avatar) avatar = interaction.user.avatarURL()
            else{
                if(avatar.value === 'guild') avatar = interaction.guild.iconURL()
                else avatar = avatar.value
            }

            channel.createWebhook(name, {avatar}).then(hook => {
                let embed = new Discord.MessageEmbed(JSON.parse(json))
                let content = interaction.options.get('content')
                if(content){
                    hook.send({
                        content: content.value,
                        embeds: [embed]
                    }).then(h => {
                        hook.delete().then(() => {
                            interaction.reply({
                                content: 'Your message was sent and the webhook was successfully deleted',
                                ephemeral: true
                            })
                        }).catch(err => {
                            interaction.reply({
                                content: 'Your message was sent, but your webhook was not deleted.\nError:\n```'+err+'```',
                                ephemeral: true
                            })
                        })
                    }).catch(err => {
                        hook.delete().then(() => {
                            interaction.reply({
                                content: 'Your webhook was deleted, but I could not send you message.\nError:\n```'+err+'```',
                                ephemeral: true
                            })
                        }).catch(err2 => {
                            interaction.reply({
                                content: `Your message could not be sent with the following reason:\n\`\`\`${err}\`\`\`\nYour webhook could not be deleted for the following reason:\n\`\`\`${err2}\`\`\``
                            })
                        })
                    })
                }else{
                    hook.send({
                        embeds: [embed]
                    }).then(h => {
                        hook.delete().then(() => {
                            interaction.reply({
                                content: 'Your message was sent and the webhook was successfully deleted',
                                ephemeral: true
                            })
                        }).catch(err => {
                            interaction.reply({
                                content: 'Your message was sent, but your webhook was not deleted.\nError:\n```'+err+'```',
                                ephemeral: true
                            })
                        })
                    }).catch(err => {
                        hook.delete().then(() => {
                            interaction.reply({
                                content: 'Your webhook was deleted, but I could not send you message.\nError:\n```'+err+'```',
                                ephemeral: true
                            })
                        }).catch(err2 => {
                            interaction.reply({
                                content: `Your message could not be sent with the following reason:\n\`\`\`${err}\`\`\`\nYour webhook could not be deleted for the following reason:\n\`\`\`${err2}\`\`\``
                            })
                        })
                    })
                }
            }).catch(err => {
                interaction.reply({
                    content: `There was an issue creating the webhook:\n\`\`\`${err}\`\`\``,
                    ephemeral: true
                })
            })
        }
    }
}