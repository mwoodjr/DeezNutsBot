require('dotenv').config()
const { Events } = require('discord.js')

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`Logged in as ${client.user.tag}!`);
        console.log(`This bot is in ${client.guilds.cache.size} guilds`)
    },
};