const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');
const url = 'https://matchilling-chuck-norris-jokes-v1.p.rapidapi.com/jokes/random';

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
    'X-RapidAPI-Host': 'matchilling-chuck-norris-jokes-v1.p.rapidapi.com'
  }
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('chucknorris')
        .setDescription('Gives you a random Chuck Norris fact'),
    async execute(interaction) {
        if (!process.env.RAPIDAPI_KEY) return interaction.reply({ content: 'This API integration is not configured.', ephemeral: true });
        await interaction.deferReply();
        try {
            await fetch(url, { ...options, timeout: 10000 })
                .then(res => res.json())
                .then(json => interaction.followUp(json.value));
        } catch(error) {
            console.log('[ERROR] There was an error with the Chuck Norris API');
        }
    }
}
