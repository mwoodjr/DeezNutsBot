const { test } = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const User = require('../schemas/userSchema');
const Server = require('../schemas/serverSchema');

test('user model validates offline and applies counter defaults', () => {
  const user = new User({ userId: 'synthetic-user', username: 'Test User', activeGuilds: ['synthetic-guild'] });
  assert.equal(user.validateSync(), undefined);
  assert.equal(user.triggerCount, 0);
  assert.equal(user.upvoteCount, 0);
  assert.equal(mongoose.connection.readyState, 0);
});
test('server model validates required metadata without connecting', () => {
  const server = new Server({ serverId: 'synthetic-guild', memberCount: 1, serverName: 'Test Guild', serverOwner: 'synthetic-owner', partnered: false, verified: false, nsfwLevel: '0', joinedAt: new Date(0), inServer: true });
  assert.equal(server.validateSync(), undefined);
  assert.equal(server.triggerCount, 0);
  assert.ok(new Server({ serverId: 'synthetic-guild' }).validateSync().errors.memberCount);
  assert.equal(mongoose.connection.readyState, 0);
});
