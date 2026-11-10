require('dotenv').config();
const mongoose = require('mongoose');
const Server = require('../schemas/serverSchema');
const { dev, connectMongoDB } = require('../config');
const { Events } = require('discord.js');

module.exports = {
    name: Events.GuildCreate,
    async execute(guild) {
        console.log(`Joined Guild | ${guild.name} (Members: ${guild.memberCount})`);

        if (connectMongoDB) {
            try {
                const result = await Server.findOneAndUpdate(
                    { serverId: guild.id },
                    {
                        serverId: guild.id,
                        joinedMemberCount: guild.memberCount,
                        serverName: guild.name,
                        serverOwner: guild.ownerId,
                        partnered: guild.partnered,
                        verified: guild.verified,
                        nsfwLevel: guild.nsfwLevel,
                        joinedAt: guild.joinedAt,
                        vanityURLCode: guild.vanityURLCode,
                        triggerCount: 0,
                        inServer: true,
                    },
                    { upsert: true, new: true }
                );
                if (dev) console.log(`Server data for ${guild.name} has been updated/created in MongoDB. Result:`);
            } catch (error) {
                console.error(`Failed to update/create server data for ${guild.name}:`);
            }
        } else {
            console.log('Did not send data to MongoDB. Developer Mode is on!');
        }
    }
};