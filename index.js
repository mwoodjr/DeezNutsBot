const { validateConfig } = require('./config');
const { ClusterManager } = require('discord-hybrid-sharding');
const path = require('node:path');

async function main() {
  validateConfig();
  // Hybrid sharding obtains Discord's recommended shard count for this token.
  const manager = new ClusterManager(path.join(__dirname, 'bot.js'), {
    totalShards: 'auto',
    shardsPerCluster: 2,
    mode: 'process',
    token: process.env.DISCORD_TOKEN,
  });
  manager.on('clusterCreate', cluster => {
    console.log(`Launched cluster ${cluster.id}`);
    cluster.on('death', () => console.log(`Cluster ${cluster.id} died`));
    cluster.on('error', () => console.error(`Cluster ${cluster.id} encountered an error; details withheld.`));
  });
  await manager.spawn({ timeout: -1 });
  // An external supervisor is required to restart the process after this exit.
  setInterval(() => {
    console.log('Scheduled restart initiated');
    process.exit(0);
  }, 24 * 60 * 60 * 1000);
}
if (require.main === module) main().catch(() => {
  console.error('Startup failed; verify configuration and connectivity.');
  process.exitCode = 1;
});
module.exports = { main };
