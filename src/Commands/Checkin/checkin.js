const { SlashCommandBuilder, channelMention } = require("discord.js");

const { checkin_add } = require("../../Services/api");
const { checkinEmbend } = require("../../Services/embeds");

const { guilds } = require('../../Config/checkin.json')

const { format } = require('date-and-time')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('checkin')
        .setDescription('Bater o ponto aqui')
        .addStringOption(option =>
            option
                .setName('tipo')
                .setDescription('Tipo de categoria')
                .setRequired(true)
                .addChoices(
                    { name: 'entrada', value: 'entry' },
                    { name: 'saida', value: 'exit' }
                )
        )
        .setDMPermission(false),

    execute: async ( interaction, client ) => {
        try {
            const guild = guilds.find(guild => guild.id === interaction.guild.id) 

            const member = interaction.member;

            if(!guild) return interaction.reply({ content: 'Esse server não foi configurado', ephemeral: true})

            if(interaction.channel.id === guild.channel.id){
                if (member.roles.cache.has(guild.role.id)) {
                    const tipo = interaction.options.getString('tipo');
                    const user = interaction.user;

                    console.log(member.user.lastMessage)

                    const {msg, error} = await checkin_add(tipo, user.id) 
                    
                    if(guild.log && !error){
                        const channel = client.channels.cache.get(guild.log.checkin.id);
                        channel.send(`\`${user.username}\` fez checkin de \`${tipo}\` as \`${format(new Date(),'YYYY/MM/DD HH:mm:ss')}\``)
                    }

                    const gitEmbed = checkinEmbend(msg, error, tipo)

                    interaction.reply({ embeds: [gitEmbed], ephemeral: error })
                }else{
                    interaction.reply({ content: 'Você não tem permição para usar esse comando', ephemeral: true})
                }
            }else {
                interaction.reply({ content: `Para fazer checkin entre nesse canal ${channelMention(guild.channel.id)}`, ephemeral: true})
            }
        } catch (error) {
            console.log(error)
        }
    }
}