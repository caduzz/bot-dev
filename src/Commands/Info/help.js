const { SlashCommandBuilder, CommandInteraction, EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, StringSelectMenuBuilder, ComponentType } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Informa os principais comando do git')
        .setDMPermission(false),

    execute: async ( interaction ) => {
        try {
            const emojisHelp = {
                dev: "💻",
                info: "📑",
                checkin: "🪪"
            }
            
            const directories = [
                ...new Set(interaction.client.commands.map(cmd => cmd.folder))
            ]

            const formatString = str => `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}` 

            const categores = directories.map(dir => {
                const getCommands = interaction.client.commands.filter(cmd => cmd.folder === dir)
                    .map(cmd => {
                        return{
                            name: cmd.data.name,
                            description: cmd.data.description || "Não ha uma descrição"
                        }
                    })

                    return{
                        directory: formatString(dir),
                        commands: getCommands
                    }
            })

            const components = state => 
            new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('help-menu')
                        .setPlaceholder('Nada Selecionado')
                        .setDisabled(state)
                        .addOptions(categores.map(cmd => {
                            return{
                                label: cmd.directory,
                                value: cmd.directory.toLowerCase(),
                                description: `Comandos ${cmd.directory} categoria`,
                                emoji: emojisHelp[cmd.directory.toLowerCase()]
                            }
                        }))
                )

            const ajudaIcon = 'https://cdn-icons-png.flaticon.com/512/7632/7632211.png';

            const helpEmbed = new EmbedBuilder()
                .setColor('#5092ff')
                .setAuthor({name: `🥶 Ajuda`})
                .setDescription('Selecione os tipos dos `comandos` que deseja')
                .setFooter({text: 'Ajuda Comandos'})
            
            const messageHelp = await interaction.reply({ 
                embeds: [helpEmbed],
                components: [components(false)],
                fetchReply: true
            })

            const collector = interaction.channel.createMessageComponentCollector({componentType: ComponentType.StringSelect});

            collector.on('collect', async i => {
                if(i.customId === 'help-menu'){
                    if(!interaction.user.id === i.user.id)return


                    const [ directory ] = i.values;
                    const category = categores.find(
                        cmd => cmd.directory.toLowerCase() === directory
                    )
                    
                    const helpNewEmbed = new EmbedBuilder()
                        .setColor('#5092ff')
                        .setAuthor({name: `${emojisHelp[directory.toLowerCase()]} Comandos da categoria ${formatString(directory)}`})
                        .setDescription(`Lista de comandos da categoria ${directory}`)
                        .setFields(
                            category.commands.map(cmd => {
                                return {
                                    name: `\`${cmd.name}\``,
                                    value: cmd.description,
                                    inline: true,
                                }
                            })
                        )
                        .setFooter({text: 'Ajuda Comandos'})

                    if(i.message.id === messageHelp.id){
                        messageHelp.edit({ embeds: [helpNewEmbed] })
                        
                        i.deferUpdate();
                    }
                }
            })
        } catch (error) {
            console.log(error)
        }
    }
}