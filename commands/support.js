const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SlashCommandBuilder } = require('discord.js')
const { inviteURL, supportURL } = require('../config')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('support')
        .setDescription('Gives you the invite to our support discord server.'),
    async execute(interaction) {
        const supportEmbed = new EmbedBuilder()
        .setColor('#d99e82')
        .setDescription(`[Invite Me](${inviteURL})`)
        .setAuthor({ name: 'Support' })

        .addFields(
            { name: 'Support Server', value: 'Join our support server by clicking the link below:'},
        )
        let inviteButton = new ButtonBuilder()
            .setURL(supportURL)
            .setLabel('Join our Support Server')
            .setStyle(5)
        const row = new ActionRowBuilder()
            .addComponents(inviteButton)

        await interaction.reply({ embeds: [supportEmbed], components: [row]});
    }
};