const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  triggerCount: { type: Number, default: 0, required: true },
  upvoteCount: { type: Number, default: 0, required: true },
  tags: { type: [String], default: [] },
  activeGuilds: { type: [String], required: true},
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema, "users");