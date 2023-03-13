const { Client } = require('discord.js')

module.exports = {
    name: 'interactionCreate',
    execute: (interaction, client) => {
        try {
            if(!interaction.isChatInputCommand()) return

            const command = client.commands.get(interaction.commandName)

            if(!command) {
                interaction.reply({content: "Esse comando não existe", ephemeral: true})
            }
            command.execute(interaction, client)
        } catch (error) {
            interaction.reply({content: "Erro ao executar este comando", ephemeral: true})
        }
    },
}