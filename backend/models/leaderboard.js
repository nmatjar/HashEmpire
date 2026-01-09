const mongoose = require('mongoose');

const LeaderboardSchema = new mongoose.Schema({
  playerId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  stats: {
    type: Object,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Leaderboard', LeaderboardSchema);
