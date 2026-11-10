let os = require('os')
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { version } = require('../package.json')
const { inviteURL, supportURL } = require('../config')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('Gives you the statistics of the bot.'),
                aliases: ["info", "ping"],
	execute(interaction) {
                if (!interaction.inGuild()) interaction.reply('You cannot use this command in DMs!')
                const totalRAM = os.totalmem();
                const freeRAM = os.freemem();
                // total amount of guilds across all shards
                const totalGuilds = interaction.client.guilds.cache.size
                // total amount of members in every guild all shards are in
                const totalMembers = interaction.client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)
                
                const statisticsEmbed = new EmbedBuilder()
                .setColor('#d99e82')
                .setDescription(`[Invite Me](${inviteURL}) - [Support Discord](${supportURL})`)
                .setAuthor({ name: 'Bot Statistics' })

                .addFields(
                        { name: 'Guilds', value: `${totalGuilds} (${interaction.client.guilds.cache.size})`, inline: true },
                        { name: 'Total Users', value: `${totalMembers}`, inline: true },
                        { name: 'Info', value: 'Ram: `' + `${Math.round(freeRAM / 1024)}/${Math.round(totalRAM / 1024)} MB` + '`' + '\nVersion: `v' + version + '`', inline: true },
                        { name: 'Other', value: 'Shard: `' + (interaction.client.cluster.id + 1) + '/' + interaction.client.cluster.count + '`'}
                )
                return interaction.reply({ embeds: [statisticsEmbed], ephemeral: true});

        }
};