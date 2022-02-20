const Discord = require('discord.js')
module.exports = {
    name: 'role',
    permissions: 'admin',
    command: {
        name: 'role',
        description: 'Create, delete, or edit a role',
        defaultPermission: false,
        options: [
            {
                name: 'create',
                description: 'Create a role',
                type: 'SUB_COMMAND',
                options: [
                    {
                        name: 'name',
                        type: 'STRING',
                        description: 'The name of the role',
                        required: true
                    },
                    {
                        name: 'color',
                        type: 'STRING',
                        description: 'A selection of preset colours to choose from',
                        required: false
                    }
                ]
            }
        ]
    }
}