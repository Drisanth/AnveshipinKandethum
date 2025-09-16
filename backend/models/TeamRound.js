const mongoose = require('mongoose');

const validationStepSchema = new mongoose.Schema({
  stepNumber: {
    type: Number,
    required: true
  },
  inputType: {
    type: String,
    enum: ['code', 'text'],
    required: true
  },
  acceptedAnswers: [{
    type: String,
    required: true
  }],
  additionalClue: {
    type: String,
    default: null
  },
  additionalClueType: {
    type: String,
    enum: ['text', 'image'],
    default: 'text'
  }
});

const teamRoundSchema = new mongoose.Schema({
  teamId: {
    type: String,
    required: true,
    ref: 'Team'
  },
  roundNumber: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },
  clueType: {
    type: String,
    enum: ['text', 'image'],
    required: true
  },
  clueContent: {
    type: String,
    required: true
  },
  validationSteps: [validationStepSchema],
  hint: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
teamRoundSchema.index({ teamId: 1, roundNumber: 1 }, { unique: true });

module.exports = mongoose.model('TeamRound', teamRoundSchema);
