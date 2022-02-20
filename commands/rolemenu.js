const Discord = require('discord.js')
module.exports = {
    name: 'rolemenu',
    permission: 'staff',
    command: {
        name: 'rolemenu',
        description: 'Create a Button Role Menu with up to 10 roles',
        defaultPermission: false,
        options: [
            {
                name: 'role1',
                description: 'A role option',
                required: true,
                type: 'ROLE'
            },
            {
                name: 'role2',
                description: 'A role option',
                required: false,
                type: 'ROLE'
            },
            {
                name: 'role3',
                description: 'A role option',
                required: false,
                type: 'ROLE'
            },
            {
                name: 'role4',
                description: 'A role option',
                required: false,
                type: 'ROLE'
            },
            {
                name: 'role5',
                description: 'A role option',
                required: false,
                type: 'ROLE'
            },
            {
                name: 'role6',
                description: 'A role option',
                required: false,
                type: 'ROLE'
            },
            {
                name: 'role7',
                description: 'A role option',
                required: false,
                type: 'ROLE'
            },
            {
                name: 'role8',
                description: 'A role option',
                required: false,
                type: 'ROLE'
            },
            {
                name: 'role9',
                description: 'A role option',
                required: false,
                type: 'ROLE'
            },
            {
                name: 'role10',
                description: 'A role option',
                required: false,
                type: 'ROLE'
            },
        ]
    },
    async execute(interaction, bot){
        let roles = [];
        for(var i = 1; i<11;i++){
            let role = interaction.options.get(`role${i}`)
            if(role){
                let button = new Discord.MessageButton()
                .setLabel(role.role.name)
                .setCustomId(`role-${role.role.id}`)
                .setStyle('SECONDARY')
                roles.push(button)
            }
        }
        let row = new Discord.MessageActionRow()
        .addComponents(roles)
        interaction.reply({
            embeds: [
                new Discord.MessageEmbed()
                .setTitle('Button Roles')
                .setColor(process.env.THEME)
                .setDescription("Press the Buttons Below to Add/Remove Roles!")
            ],
            components: [row]
        })
    }
}