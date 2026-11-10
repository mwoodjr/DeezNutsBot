const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { inviteURL, supportURL } = require('../config')
const User = require('../schemas/userSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('Get information about yourself'),
    async execute(interaction) {
        if (!require('../config').connectMongoDB) return interaction.reply({ content: 'Database features are disabled.', ephemeral: true });
        await interaction.deferReply()

        const users = await User.findOne({ userId: interaction.user.id }).then()

        return interaction.followUp({ embeds: [
            new EmbedBuilder()
            .setAuthor({ name: `${users.username}'s Profile`, iconURL: `${interaction.user.avatarURL()}` })
                .setColor("#d99e82")
                .setDescription(`[Invite Me](${inviteURL}) - [Support Discord](${supportURL})`)
                .setThumbnail(`${interaction.user.avatarURL()}`)
                .addFields(
                    { name: 'Username:', value: `${interaction.user.username}`, inline: false},
                    { name: 'User ID:', value: '`' + `${interaction.user.id}` + '`', inline: false},
                    { name: 'Trigger Count:', value: '`' + `${users.triggerCount}` + '`', inline: false},
                    { name: 'Upvotes:', value: '`' + `${users.upvoteCount}` + '`', inline: false},
                )
        ]})

    }
}