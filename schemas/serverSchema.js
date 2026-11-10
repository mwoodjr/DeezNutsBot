const mongoose = require('mongoose');

const serverSchema = new mongoose.Schema({
    serverId: { type: String, required: true, unique: true },
    memberCount: { type: Number, required: true },
    serverName: { type: String, required: true },
    serverOwner: { type: String, required: true },
    partnered: { type: Boolean, required: true },
    verified: { type: Boolean, required: true },
    nsfwLevel: { type: String, required: true },
    joinedAt: { type: Date, required: true },
    vanityURLCode: { type: String },
    triggerCount: { type: Number, default: 0, required: true },
    inServer: { type: Boolean, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Server', serverSchema, 'servers');