const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ComponentType, StringSelectMenuBuilder } = require("discord.js");

const git = require('../../Config/git.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('git')
        .setDescription('Informa os principais comando do git')
        .setDMPermission(false),

    execute: async ( interaction, client ) => {
        try {
            const gitIcon = 'https://git-scm.com/images/logos/downloads/Git-Icon-1788C.png';
            const components = state => 
                new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId('git-menu')
                            .setPlaceholder('Nada Selecionado')
                            .setDisabled(state)
                            .addOptions(git)
                    )

            const gitEmbed = new EmbedBuilder()
                .setColor('#f05033')
                .setTitle('Git Help')
                .setDescription('Selecione os Nivel dos `comandos` que deseja')
                .setThumbnail(gitIcon)
                .setFields({
                    name: 'Niveis',
                    value: `${git.map(g => g.emoji + ' ' + g.label)}`
                })
                .setFooter({text: 'commands Git', iconURL: gitIcon})
            
            const message = await interaction.reply({ embeds: [gitEmbed], fetchReply: true, components: [components(false)] })
            
            const collector = interaction.channel.createMessageComponentCollector({componentType: ComponentType.StringSelect });

            collector.on('collect', async i => {
                if(i.customId === 'git-menu'){
                    if(!interaction.user.id === i.user.id)return

                    const value = i.values[0]
                    
                    const gitFilter = git.filter(g => g.value === value)

                    const gitFinalEmbed = new EmbedBuilder()
                        .setColor('#f05033')
                        .setTitle(`${gitFilter[0].emoji}  Git ${gitFilter[0].label}`)
                        .setFields(gitFilter[0].options)
                        .setThumbnail(gitIcon)
                    
                    if(i.message.id === message.id){
                        message.edit({ embeds: [gitFinalEmbed] })
                        
                        i.deferUpdate();
                    }
                }
            })
            collector.on('end', async i => {
                message.edit({ components: [components(true)] })
            })

        } catch (error) {
            console.log(error)
        }
    }
}