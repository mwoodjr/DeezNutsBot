const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SlashCommandBuilder} = require('discord.js');
const { inviteURL, supportURL, upvoteURL } = require('../config')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('vote')
		.setDescription('Upvote our bot with this command.'),
        aliases: ["upvote"],
	async execute(interaction) {
        const upvoteEmbed = new EmbedBuilder()
        .setColor('#d99e82')
        .setDescription(`[Invite Me](${inviteURL}) - [Support Discord](${supportURL})`)
        .setAuthor({ name: 'Upvote Us' })

        .addFields(
            {name: 'Upvote', value: 'Click the link below to upvote us:'}
        )

        let topggButton = new ButtonBuilder()
            .setURL(upvoteURL)
                    .setLabel('Top.gg')
                    .setStyle(5)

        const buttonRow = new ActionRowBuilder()
            .addComponents(topggButton);

        await interaction.reply({ embeds: [upvoteEmbed], components: [buttonRow] });
    }
};