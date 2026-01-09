const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
  playerId: {
    type: String,
    required: true,
    index: true,
  },
  data: {
    type: Object,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Analytics', AnalyticsSchema);
