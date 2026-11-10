const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dadjoke')
        .setDescription('Gives you a random Dad joke!'),
    async execute(interaction) {
        await interaction.deferReply();
        try {
            await fetch('https://icanhazdadjoke.com/', {
                timeout: 10000,
                method: 'get',
                headers: {
                    'Accept': 'application/json'
                }
            }).then(res => res.json()).then(json => interaction.followUp(json.joke));
        } catch(error) {
            console.log('[ERROR] Dad Joke API not working correctly');
        }
    }
}
