const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { inviteURL, supportURL } = require('../config')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Gives you the latency of the bot.'),
    execute(interaction) {
        const pingEmbed = new EmbedBuilder()
        .setColor('#d99e82')
        .setDescription(`[Invite Me](${inviteURL}) - [Support Discord](${supportURL})`)
        .setAuthor({ name: 'Ping'})

        .addFields({
            name: 'Websocket Latency:',
            value: `${interaction.client.ws.ping}ms`
        })
        interaction.reply({ embeds: [pingEmbed] });
    }
}