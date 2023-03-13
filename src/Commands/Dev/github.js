const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const { git_user } = require("../../Services/api");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('git_hub')
        .setDescription('Pega as informações de um usuario git')
        .addStringOption(option =>
            option
                .setName('user')
                .setDescription('Git hub name')
                .setRequired(true)
        )
        .setDMPermission(true),

    execute: async ( interaction ) => {
        const user = interaction.options.getString('user')

        const gitInfos = await git_user(user) 
        if(!gitInfos) return interaction.reply({ content: 'usuario não encontrado', ephemeral: true })
        const gitIcon = 'https://static-00.iconduck.com/assets.00/github-icon-512x499-ziwq0a1i.png'
        const gitHubEmbed = new EmbedBuilder()
            .setColor('#111')
            .setDescription(`
                **Algumas informações [\`${user}\`](${gitInfos.html_url})**

                **bio**: \`${gitInfos.bio}\`
                **local**: \`${gitInfos.location}\` **empresa**: \`${gitInfos.company}\`

                [repositorios:](https://github.com/${user}?tab=repositories) \`${gitInfos.public_repos}\` | [seguidores:](https://github.com/${user}?tab=followers) \`${gitInfos.followers}\` | [seguindo:](https://github.com/${user}?tab=following) \`${gitInfos.following}\` 
            `)
            .setThumbnail(gitInfos.avatar_url)
            .setFooter({text: 'GitHub infos', iconURL: gitIcon})
        
        await interaction.reply({ embeds: [gitHubEmbed] })
    }
}