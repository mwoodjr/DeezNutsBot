const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.join(__dirname, '..');
const testApplicationId = '1'.repeat(18); // Synthetic ID, not a real application.
function load(file, mocks = {}, env = {}) {
  const module = { exports: {} };
  const sandbox = { module, exports: module.exports, __dirname: path.dirname(path.join(root, file)),
    console: { log() {}, error() {} }, process: { env: { ...env } },
    require(name) { if (name in mocks) return mocks[name]; throw new Error(`Unexpected dependency: ${name}`); },
    setInterval() {}, };
  vm.runInNewContext(fs.readFileSync(path.join(root, file), 'utf8'), sandbox, { filename: file });
  return module.exports;
}
function config(env) { return load('config.js', { dotenv: { config() {} } }, env); }
test('configuration rejects missing credentials without including their values', () => {
  assert.throws(() => config({}).validateConfig(), /Missing configuration/);
  const env = { DISCORD_TOKEN: 'synthetic-test-value', DISCORD_CLIENT_ID: 'invalid', MONGODB_URI: 'mongodb://localhost/test' };
  try { config(env).validateConfig(); assert.fail('must reject'); }
  catch (error) { assert.match(error.message, /application ID/); assert.ok(!error.message.includes(env.DISCORD_TOKEN)); }
});
test('registration needs Discord configuration but no database credentials', () => {
  config({ DISCORD_TOKEN: 'synthetic-test-value', DISCORD_CLIENT_ID: testApplicationId }).validateConfig({ registration: true });
});
test('database configuration is validated conditionally', () => {
  const base = { DISCORD_TOKEN: 'synthetic-test-value', DISCORD_CLIENT_ID: testApplicationId };
  config({ ...base, CONNECT_MONGODB: 'false' }).validateConfig();
  assert.throws(() => config({ ...base, MONGODB_URI: 'https://example.com' }).validateConfig(), /MongoDB connection URI/);
  assert.throws(() => config({ ...base, CONNECT_MONGODB: 'no' }), /true or false/);
});
test('database-disabled helpers do not read or write models, even outside development mode', async () => {
  const deny = new Proxy({}, { get() { throw new Error('Database access attempted'); } });
  const util = load('utils/dbUtil.js', { '../config': { dev: false, connectMongoDB: false }, '../schemas/serverSchema': deny, '../schemas/userSchema': deny });
  await util.checkServerData('test'); await util.checkUserData('test');
  await util.createServerData('test'); await util.createUserData('test');
  await util.updateServerData('test', {}); await util.updateUserData('test', {});
  await util.updateUser({ author: {} }, {}); await util.updateServer({ guild: {} }, {});
});
test('database commands report disabled mode before querying', async () => {
  class Builder { setName() { return this; } setDescription() { return this; } }
  const deny = new Proxy({}, { get() { throw new Error('Database access attempted'); } });
  for (const name of ['user', 'leaderboard']) {
    let replied = false;
    const command = load(`commands/${name}.js`, { 'discord.js': { SlashCommandBuilder: Builder }, '../config': { connectMongoDB: false }, '../schemas/userSchema': deny });
    await command.execute({ reply(payload) { assert.match(payload.content, /disabled/); replied = true; } });
    assert.ok(replied);
  }
});
test('missing RapidAPI key makes no external request', async () => {
  class Builder { setName() { return this; } setDescription() { return this; } }
  let replied = false;
  const command = load('commands/chucknorris.js', { 'discord.js': { SlashCommandBuilder: Builder }, 'node-fetch': () => assert.fail('network called') });
  await command.execute({ reply(payload) { assert.match(payload.content, /not configured/); replied = true; } });
  assert.ok(replied);
});
test('cluster startup validates before spawning and uses automatic shards in process mode', async () => {
  let validated = false, spawned = false, options;
  class Manager {
    constructor(file, opts) { assert.ok(validated); assert.ok(file.endsWith('bot.js')); options = opts; }
    on() {}
    async spawn() { spawned = true; }
  }
  const app = load('index.js', { './config': { validateConfig() { validated = true; } }, 'discord-hybrid-sharding': { ClusterManager: Manager }, 'node:path': path }, { DISCORD_TOKEN: 'synthetic-test-value' });
  await app.main();
  assert.ok(spawned); assert.equal(options.totalShards, 'auto'); assert.equal(options.shardsPerCluster, 2); assert.equal(options.mode, 'process');
});
test('configuration failure stops cluster startup', async () => {
  const app = load('index.js', { './config': { validateConfig() { throw new Error('missing configuration'); } }, 'discord-hybrid-sharding': { ClusterManager: class { constructor() { assert.fail('spawn attempted'); } } }, 'node:path': path });
  await assert.rejects(app.main(), /missing configuration/);
});
