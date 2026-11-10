const { validateConfig } = require('./config');
validateConfig();
const { ClusterClient, getInfo } = require('discord-hybrid-sharding');
const { Client, Collection, GatewayIntentBits } = require('discord.js');

const client = new Client({
    shards: getInfo().SHARD_LIST,
    shardCount: getInfo().TOTAL_SHARDS,
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] 
});

client.cluster = new ClusterClient(client);

// Import the mongoose module
const mongoose = require('mongoose');
const { connectMongoDB } = require('./config');

if (connectMongoDB) {
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => {
            console.log('Connected to MongoDB!');
        }).catch(err => console.log('MongoDB connection error:'));

} else {
    console.log('MongoDB connection is disabled in config.');
}

// Event Handler
const fs = require('node:fs');
const path = require('node:path');
const eventPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

// Command Handler
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

console.log('\n')
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
    console.log(`✅ | Command Handler | /${command.data.name}`)
};
console.log(` \n`)

// I hate handling errors. 
// This just doesn't let the bot crash and auto-restart whenever there is an API error.
process.on('unhandledRejection', error => {
    console.error('[ERROR] Unhandled promise rejection:');
});

// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN).catch(() => {
    console.error('Discord login failed; verify configuration.');
    process.exitCode = 1;
});