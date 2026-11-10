const { Events } = require('discord.js');
const { updateUser, updateServer } = require('../utils/dbUtil');
const { dev, connectMongoDB } = require('../config');
const jokes = require('../utils/jokes.js');



function advertise(message) {
    let chance = Math.random();
    if (chance < 0.01) {
        message.channel.send('**Hey! Like our bot?** Did you know that upvoting our bot helps support us and can give you *~special perks~*! Use **/vote** to learn more.');
    }
}

//Implement stat counter for users and guilds using the bot, increment by 1 each time a user triggers a keyword
async function sendData(message) {
    if (connectMongoDB) {
        try {
            // Update user data
            const userUpdate = {
                $inc: { triggerCount: 1 },
                $set: { username: message.author.username },
                $addToSet: { activeGuilds: message.guildId }
            };
            const userOptions = { upsert: true, new: true, setDefaultsOnInsert: true };
            await updateUser(message, userUpdate, userOptions)
            
            // Update guild data
            const guildUpdate = { 
                $inc: { triggerCount: 1 },
                $set: { serverName: message.guild.name },
                $set: { partnered: message.guild.partnered },
                $set: { verified: message.guild.verified },
                $set: { nsfwLevel: message.guild.nsfwLevel },
                $set: { vanityURLCode: message.guild.vanityURLCode },
                $set: { memberCount: message.guild.memberCount },
                $set: { serverOwner: message.guild.ownerId },
            };
            const guildOptions = { upsert: true, new: true, setDefaultsOnInsert: true };
            await updateServer(message, guildUpdate, guildOptions)

        } catch (error) {
            console.error(`Failed to update/create user or guild data:`);
        }
    } else {
        console.log('Did not send data to MongoDB. Developer Mode is on!');
    }
}


module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        try {
            if (message.author.bot) return;

            const content = message.content.toLowerCase();
            for (const [keyword, response] of Object.entries(jokes)) {
                if (content.includes(keyword)) {
                    if (response) {
                        // reply to user's message with response
                        message.reply(response);
                    }
                    message.react('🥜');
                    advertise(message);
                    await sendData(message);

                    break;
                }
            }
        } catch (e) {
            console.log(`[ERROR] Guild ID: ${message.guildId} | User: ${message.author.username}#${message.author.discriminator} couldn't send message or react in channel ${message.channelId} [details withheld]`);
        }
    },
};