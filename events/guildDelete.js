const { Events } = require('discord.js');
const Server = require('../schemas/serverSchema');
require('dotenv').config();
const { dev, connectMongoDB } = require('../config');

module.exports = {
    name: Events.GuildDelete,
    async execute(guild) {
        console.log(`Left Guild | ${guild.name} (Members: ${guild.memberCount})`);

        if (connectMongoDB) {
            try {
                await Server.findOneAndUpdate(
                    { serverId: guild.id },
                    { inServer: false }
                );
                if (dev) console.log(`Server data for ${guild.name} has been updated in MongoDB.`);
            } catch (error) {
                console.error(`Failed to update server data for ${guild.name}:`);
            }
        } else {
            console.log('Did not send data to MongoDB. Developer Mode is on!');
        }
    }
};