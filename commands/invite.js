const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, SlashCommandBuilder } = require('discord.js');
const { supportURL, inviteURL } = require('../config')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Lets you invite me to a server!'),
    async execute(interaction) {
        const inviteEmbed = new EmbedBuilder()
        .setColor('#d99e82')
        .setDescription(`[Support Discord](${supportURL})`)
        .setAuthor({ name: 'Invite Me' })

        .addFields(
            {name: 'Invite', value: 'Click the link below to invite me:'}
        )

        let inviteButton = new ButtonBuilder()
            .setURL(inviteURL)
                    .setLabel('Invite Me')
                    .setStyle(5)

        const buttonRow = new ActionRowBuilder()
            .addComponents(inviteButton);

        await interaction.reply({embeds: [inviteEmbed], components: [buttonRow] });
    }
}