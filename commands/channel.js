const Discord = require('discord.js')
module.exports = {
    name: 'channel',
    permission: 'staff',
    command: {
        name: 'channel',
        description: 'Create or Delete Channels',
        defaultPermission: false,
        options: [
            {
                name: 'create',
                type: "SUB_COMMAND",
                description: 'Create a channel',
                options: [
                    {
                        name: 'category',
                        description: 'The category the channel will be put into',
                        required: true,
                        type: 'CHANNEL'
                    },
                    {
                        name: 'type',
                        description: 'The type of channel being created',
                        required: true,
                        type: 'STRING',
                        choices: [
                            {name: 'text', value: "GUILD_TEXT"},
                            {name: 'voice', value: "GUILD_VOICE"},
                            {name: 'news', value: "GUILD_NEWS"},
                            {name: 'stage', value: "GUILD_STAGE_VOICE"}
                        ]
                    },
                    {
                        name: 'name',
                        description: 'The name of the new channel',
                        required: true,
                        type: 'STRING'
                    }
                ]
            },
            {
                name: 'delete',
                type: 'SUB_COMMAND',
                description: 'Delete a channel',
                options: [
                    {
                        name: 'channel',
                        description: 'The channel to be deleted',
                        required: true,
                        type: 'CHANNEL'
                    }
                ]
            }
        ]
    },
    async execute(interaction, bot){
        if(interaction.options._subcommand == 'delete'){
            let channel = interaction.options.get('channel').channel
            channel.delete().then(() => {
                interaction.reply({
                    content: "Channel deleted!",
                    ephemeral: true
                })
            })
        }else{
            let channel = interaction.options.get('category').channel
            let type = interaction.options.get('type').value
            let name = interaction.options.get('name').value
            if(!channel.type == 'CATEGORY'){
                interaction.reply({
                    content: "Your selected channel was not a category channel!",
                    ephemeral: true
                })
            }else{
                interaction.guild.channels.create(name, {type: type, parent: channel}).then(() => {
                    interaction.reply({
                        content: "The channel had been created!",
                        ephemeral: true
                    })
                }).catch(err => {
                    interaction.reply('There was an error creating the channel:\n```'+err+"```")
                })
            }
        }
    }
}