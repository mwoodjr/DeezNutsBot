const { EmbedBuilder, SlashCommandBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const User = require('../schemas/userSchema');
const { upvoteURL } = require('../config')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Shows the global leaderboard.'),
    async execute(interaction) {
        if (!require('../config').connectMongoDB) return interaction.reply({ content: 'Database features are disabled.', ephemeral: true });
        await interaction.deferReply({ephemeral: true})

        const users = await User.find()

        const sortedUsers = users.sort((a, b) => {
            return b.upvoteCount - a.upvoteCount
        }).slice(0, 10)

        const leaderboardEmbed = new EmbedBuilder()
            .setAuthor({ name: `Upvote Leaderboard`})
            .setColor("#d99e82")
            .setDescription(
                sortedUsers.map((user, index) => {
                return `**\`[ ${index + 1} ]\`** : **${user.username}** : \` ${user.upvoteCount} \``
            }).join("\n"))

        const upvoteButton =  new ButtonBuilder()
            .setURL(upvoteURL)
            .setLabel('Vote')
            .setStyle(5)
        
        const row = new ActionRowBuilder().addComponents(upvoteButton)

        leaderboardEmbed.setFooter({ text: 'Click the button below to upvote my bot!'})
        leaderboardEmbed.setTimestamp()

        return interaction.followUp({ embeds: [leaderboardEmbed], components: [row] })
    }
}