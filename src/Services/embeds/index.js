const { EmbedBuilder } = require("discord.js");

module.exports = {
    checkinEmbend: (msg, error, tipo) => {
        const successIcon = 'https://cdn-icons-png.flaticon.com/256/7518/7518748.png';
        const erroIcon = 'https://cdn-icons-png.flaticon.com/256/4457/4457164.png';

        const icon = error ? erroIcon : successIcon

        tipo = tipo != undefined ? tipo === 'entry' ? 'de entrada' : 'de saida' : ''

        return new EmbedBuilder()
            .setColor(error ? '#eb483c' : '#40b457')
            .setAuthor({name: `${msg} ${tipo}`, iconURL: icon})
    }
}