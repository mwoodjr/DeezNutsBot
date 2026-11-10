const { dev, connectMongoDB } = require('../config');
const Server = require("../schemas/serverSchema");
const User = require("../schemas/userSchema");


// check database for valid server entry, ensuring there is no missing data
async function checkServerData(serverId) {
    if (connectMongoDB) {
        try {
            const server = await Server.findOne({ serverId: serverId });
            if (!server) {
                console.log(`Server data for ${serverId} does not exist in MongoDB.`);
                return false;
            }
            return true;
        } catch (error) {
            console.error(`Failed to check server data for ${serverId}:`);
            return false;
        }
    }
    return true;
}

// make new database entry for server
async function createServerData(serverId, memberCount, serverName, serverOwner, partnered, verified, nsfwLevel, joinedAt, vanityURLCode, inServer) {
    if (connectMongoDB) {
        try {
            const server = new Server({
                serverId: serverId,
                memberCount: memberCount,
                serverName: serverName,
                serverOwner: serverOwner,
                partnered: partnered,
                verified: verified,
                nsfwLevel: nsfwLevel,
                joinedAt: joinedAt,
                vanityURLCode: vanityURLCode,
                inServer: true
            });
            const result = await server.save();
            if (dev) console.log(`New server data for ${serverId} has been created in MongoDB. Result:`);
        } catch (error) {
            console.error(`Failed to create new server data for ${serverId}:`);
        }
    } else {
        console.log('Did not create new server data in MongoDB. Developer Mode is on!');
    }
}

// update server data in database with new information
async function updateServerData(serverId, data, options) {
    if (connectMongoDB) {
        try {
            const serverResult = await Server.findOneAndUpdate({ serverId: serverId }, data, options);
            if (dev) console.log(`Server data for ${serverId} has been updated in MongoDB. Result:`);
        } catch (error) {
            console.error(`Failed to update server data for ${serverId}:`);
        }
    } else {
        console.log('Did not update server data in MongoDB. Developer Mode is on!');
    }
}

// check database for valid user entry, ensuring there is no missing data
async function checkUserData(userId) {
    if (connectMongoDB) {
        try {
            const user = await User.findOne({ userId: userId });
            if (!user) {
                console.log(`User data for ${userId} does not exist in MongoDB.`);
                return false;
            }
            return true;
        } catch (error) {
            console.error(`Failed to check user data for ${userId}:`);
            return false;
        }
    }
    return true;
}

async function createUserData(userId, userName, guildId) {
    if (connectMongoDB) {
        try {
            const user = new User({
                userId: userId,
                username: userName,
                triggerCount: 0,
                upvoteCount: 0,
                tags: [],
                activeGuilds: guildId
            });
            const result = await user.save();
            if (dev) console.log(`New user data for ${userId} has been created in MongoDB. Result:`);
        } catch (error) {
            console.error(`Failed to create new user data for ${userId}:`);
        }
    } else {
        console.log('Did not create new user data in MongoDB. Developer Mode is on!');
    }
}

// update user data in database with new information
async function updateUserData(userId, data, options) {
    if (connectMongoDB) {
        try {
            const userResult = await User.findOneAndUpdate({ userId: userId }, data, options);
            if (dev) console.log(`User data for ${userId} has been updated in MongoDB. Result:`);
        } catch (error) {
            console.error(`Failed to update user data for ${userId}:`);
        }
    } else {
        console.log('Did not update server data in MongoDB. Developer Mode is on!');
    }
}

// seamlessly updates user data, creates new entry if there isn't one found and handles errors
async function updateUser(message, data, options) {
    const user = message.author;
    if (connectMongoDB) {
        try {
            // check for user data using checkUserData function
            const userExists = await checkUserData(user.id);

            if (!userExists) {
                // Create new user entry if it doesn't 
                await createUserData(user.id, user.username, message.guild.id);
                await updateUserData(user.id, data, options);
                if (dev) console.log(`New user data for ${user.id} has been created in MongoDB.`)
                
            } else {
                // Update existing user data
                await updateUserData(user.id, data, options);
            }

        } catch (error) {
            console.error(`Failed to update user data for ${user.id}:`);
        }
    } else {
        console.log('Did not update User data in MongoDB. Developer mode is on!')
    }
}

async function updateServer(message, data, options) {
    const server = message.guild;
    if (connectMongoDB) {
        try {
            // Check for server data using checkServerData
            const serverExists = await checkServerData(server.id);
            
            if (!serverExists) {
                // Create new server entry if it doesn't exist
                await createServerData(server.id, server.memberCount, server.name, server.ownerId, server.partnered, server.verified, server.nsfwLevel, server.joinedAt, server.vanityURLCode, data.triggerCount, true);
                await updateServerData(server.id, data, options)
                if (dev) console.log(`New server data for ${server.id} has been created in MongoDB.`);
            } else {
                // Update existing server data
                await updateServerData(server.id, data, options)
            }
        } catch (error) {
            console.error(`Failed to update server data for ${server.id}:`);
        }
    } else {
        console.log('Did not update Server data in MongoDB. Developer mode is on!')
    }
}

module.exports = {
    checkServerData,
    createServerData,
    updateServerData,
    checkUserData,
    createUserData,
    updateUserData,
    updateUser,
    updateServer
}