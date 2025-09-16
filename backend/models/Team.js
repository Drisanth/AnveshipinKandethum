const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  teamId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  teamName: {
    type: String,
    required: true,
    trim: true
  },
  currentRound: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  currentStep: {
    type: Number,
    default: 0
  },
  completedSteps: [{
    roundNumber: Number,
    stepNumber: Number,
    completedAt: {
      type: Date,
      default: Date.now
    }
  }],
  totalAttempts: {
    type: Number,
    default: 0
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster queries
teamSchema.index({ teamId: 1 });
teamSchema.index({ currentRound: 1 });

module.exports = mongoose.model('Team', teamSchema);
