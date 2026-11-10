const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { inviteURL, supportURL } = require('../config')
const jokes = require('../utils/jokes.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('list')
        .setDescription(`Gives you a list of the bot's trigger words`),
    async execute(interaction) {
        const listEmbed = new EmbedBuilder()
        .setColor('#d99e82')
        .setDescription(`[Invite Me](${inviteURL}) - [Support Discord](${supportURL})`)
        .setAuthor({ name: 'Actions List' })

        for (const [trigger, response] of Object.entries(jokes)) {
            listEmbed.addFields({ name: trigger, value: `\`${response}\``, inline: true });
        }
        
        await interaction.reply({ embeds: [listEmbed], ephemeral: true })
    }
}