require('dotenv').config({ quiet: true });

function flag(name, fallback) {
  const value = process.env[name];
  if (value === undefined || value === '') return fallback;
  if (!['true', 'false'].includes(value)) throw new Error(`${name} must be true or false`);
  return value === 'true';
}
function validateConfig({ registration = false } = {}) {
  const names = ['DISCORD_TOKEN', 'DISCORD_CLIENT_ID'];
  if (!registration && flag('CONNECT_MONGODB', true)) names.push('MONGODB_URI');
  const missing = names.filter(name => !process.env[name] || /^(replace|your_|<)/i.test(process.env[name]));
  if (missing.length) throw new Error(`Missing configuration: ${missing.join(', ')}`);
  if (!/^\d{17,20}$/.test(process.env.DISCORD_CLIENT_ID)) throw new Error('DISCORD_CLIENT_ID must be a Discord application ID');
  if (!registration && flag('CONNECT_MONGODB', true) && !/^mongodb(?:\+srv)?:\/\//.test(process.env.MONGODB_URI)) {
    throw new Error('MONGODB_URI must be a MongoDB connection URI');
  }
}
module.exports = {
  dev: flag('DEV', false),
  connectMongoDB: flag('CONNECT_MONGODB', true),
  inviteURL: process.env.INVITE_URL || `https://discord.com/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID || '000000000000000000'}&scope=bot%20applications.commands&permissions=68608`,
  supportURL: process.env.SUPPORT_URL || 'https://example.com/support',
  upvoteURL: process.env.UPVOTE_URL || 'https://example.com/vote',
  validateConfig,
};
