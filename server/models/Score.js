const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  score: {
    type: Number,
    required: true
  },
  attempts: {
    type: Number,
    default: 1
  },
  sessionId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

scoreSchema.index({ studentId: 1, sessionId: 1 });

module.exports = mongoose.model('Score', scoreSchema);