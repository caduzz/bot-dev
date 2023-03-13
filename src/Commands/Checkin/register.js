const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { user_add } = require("../../Services/api");
const { checkinEmbend } = require("../../Services/embeds");

const { guilds } = require('../../Config/checkin.json');
const { format } = require("date-and-time");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user_register')
        .setDescription('Registrar usaurio')
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription('Nome Usuario')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('email')
                .setDescription('Email Usuario')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('senha')
                .setDescription('Senha Usario')
                .setRequired(true)
        )
        .setDMPermission(false),

    execute: async ( interaction, client ) => {
        try {   
            const guild = guilds.find(guild => guild.id === interaction.guild.id) 

            const member = interaction.member;

            if(!guild) return interaction.reply({ content: 'Esse server não foi configurado', ephemeral: true})

            if (member.roles.cache.has(guild.role.id)) {
                const user = interaction.user;
                
                const name = interaction.options.getString('name');
                const email = interaction.options.getString('email');
                const password = interaction.options.getString('senha');
                const id = interaction.user.id;

                const {msg, error} = await user_add(id, name, email, password)

                if(guild.log && !error){
                    const channel = client.channels.cache.get(guild.log.register.id);
                    channel.send(`\`${user.username}\` registrador email: \`${email}\`, as \`${format(new Date(),'DD/MM/YYYY HH:mm:ss')}\``)
                }

                const gitEmbed = checkinEmbend(msg, error)

                interaction.reply({ embeds: [gitEmbed], ephemeral: error})
            } else{
                interaction.reply({ content: 'Você não tem permição para usar esse comando', ephemeral: true})
            }
        } catch (error) {
            console.log(error)
        }
    }
}