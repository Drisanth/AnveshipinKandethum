const express = require('express');
const Team = require('../models/Team');
const TeamRound = require('../models/TeamRound');
const { verifyTeamToken } = require('../middleware/auth');

const router = express.Router();

// Get current round and clues for a team
router.get('/round/:teamId', verifyTeamToken, async (req, res) => {
  try {
    const { teamId } = req.params;
    const team = req.team;

    // Get current round data
    const roundData = await TeamRound.findOne({ 
      teamId: teamId, 
      roundNumber: team.currentRound 
    });

    if (!roundData) {
      return res.status(404).json({ 
        message: `Round ${team.currentRound} not found for team ${teamId}` 
      });
    }

    // Get current step data
    const currentStep = roundData.validationSteps.find(
      step => step.stepNumber === team.currentStep
    );

    if (!currentStep) {
      return res.status(404).json({ 
        message: `Step ${team.currentStep} not found in round ${team.currentRound}` 
      });
    }

    // Check if this step is already completed
    const isStepCompleted = team.completedSteps.some(
      completed => completed.roundNumber === team.currentRound && 
                   completed.stepNumber === team.currentStep
    );

    res.json({
      success: true,
      round: {
        roundNumber: roundData.roundNumber,
        clueType: roundData.clueType,
        clueContent: roundData.clueContent,
        currentStep: {
          stepNumber: currentStep.stepNumber,
          inputType: currentStep.inputType,
          additionalClue: currentStep.additionalClue,
          additionalClueType: currentStep.additionalClueType,
          isCompleted: isStepCompleted
        },
        totalSteps: roundData.validationSteps.length,
        isRoundComplete: team.currentStep >= roundData.validationSteps.length - 1
      }
    });

  } catch (error) {
    console.error('Get round error:', error);
    res.status(500).json({ message: 'Server error while fetching round data' });
  }
});

// Validate user input
router.post('/validate', verifyTeamToken, async (req, res) => {
  try {
    const { teamId, roundNumber, stepNumber, userInput } = req.body;
    const team = req.team;

    if (!userInput || userInput.trim() === '') {
      return res.status(400).json({ message: 'Input is required' });
    }

    // Determine effective round and step (handle 0 correctly)
    const effectiveRoundNumber = (roundNumber === undefined || roundNumber === null) ? team.currentRound : roundNumber;
    const effectiveStepNumber = (stepNumber === undefined || stepNumber === null) ? team.currentStep : stepNumber;

    // Get round data
    const roundData = await TeamRound.findOne({ 
      teamId: teamId, 
      roundNumber: effectiveRoundNumber 
    });

    if (!roundData) {
      return res.status(404).json({ message: 'Round not found' });
    }

    // Get step data
    const stepData = roundData.validationSteps.find(
      step => step.stepNumber === effectiveStepNumber
    );

    if (!stepData) {
      return res.status(404).json({ message: 'Step not found' });
    }

    // Check if this effective step is already completed
    const isStepCompleted = team.completedSteps.some(
      completed => completed.roundNumber === effectiveRoundNumber && 
                   completed.stepNumber === effectiveStepNumber
    );

    if (isStepCompleted) {
      return res.json({
        success: true,
        message: 'Step already completed',
        nextClue: stepData.additionalClue,
        nextClueType: stepData.additionalClueType
      });
    }

    // Validate input (case-insensitive, trimmed)
    const normalizedInput = userInput.trim().toLowerCase();
    const isValid = stepData.acceptedAnswers.some(answer => 
      answer.trim().toLowerCase() === normalizedInput
    );

    // Increment total attempts
    team.totalAttempts += 1;

    if (isValid) {
      // Mark step as completed
      team.completedSteps.push({
        roundNumber: effectiveRoundNumber,
        stepNumber: effectiveStepNumber
      });

      // Check if this is the last step of the round
      const isLastStep = effectiveStepNumber >= roundData.validationSteps.length - 1;
      
      if (effectiveStepNumber === team.currentStep) {
        if (isLastStep) {
          // Round completed, prepare for next round
          team.currentRound += 1;
          team.currentStep = 0;
        } else {
          // Move to next step
          team.currentStep += 1;
        }
      }

      await team.save();

      res.json({
        success: true,
        message: 'You are good to go!',
        nextClue: stepData.additionalClue,
        nextClueType: stepData.additionalClueType,
        isLastStep: isLastStep,
        canProceed: isLastStep
      });
    } else {
      await team.save();
      res.json({
        success: false,
        message: 'Try again'
      });
    }

  } catch (error) {
    console.error('Validation error:', error);
    res.status(500).json({ message: 'Server error during validation' });
  }
});

// Move to next round (after 10-second delay)
router.post('/next', verifyTeamToken, async (req, res) => {
  try {
    const team = req.team;

    // Check if team can proceed to next round
    if (team.currentRound >= 5) {
      return res.json({
        success: true,
        message: 'Game completed!',
        isGameComplete: true
      });
    }

    // Get current round data to verify completion
    const roundData = await TeamRound.findOne({ 
      teamId: team.teamId, 
      roundNumber: team.currentRound 
    });

    if (!roundData) {
      return res.status(404).json({ message: 'Current round not found' });
    }

    // Check if all steps are completed
    const completedStepsInRound = team.completedSteps.filter(
      completed => completed.roundNumber === team.currentRound
    );

    if (completedStepsInRound.length < roundData.validationSteps.length) {
      return res.status(400).json({ 
        message: 'Current round not completed yet' 
      });
    }

    res.json({
      success: true,
      message: 'Ready for next round',
      nextRound: team.currentRound,
      isGameComplete: team.currentRound >= 5
    });

  } catch (error) {
    console.error('Next round error:', error);
    res.status(500).json({ message: 'Server error while moving to next round' });
  }
});

// Get hint for a round
router.get('/hint/:teamId/:roundNumber', verifyTeamToken, async (req, res) => {
  try {
    const { teamId, roundNumber } = req.params;
    const team = req.team;

    // Verify team can access this round
    if (parseInt(roundNumber) > team.currentRound) {
      return res.status(403).json({ 
        message: 'Cannot access hint for future rounds' 
      });
    }

    const roundData = await TeamRound.findOne({ 
      teamId: teamId, 
      roundNumber: parseInt(roundNumber) 
    });

    if (!roundData) {
      return res.status(404).json({ message: 'Round not found' });
    }

    res.json({
      success: true,
      hint: roundData.hint,
      roundNumber: roundData.roundNumber
    });

  } catch (error) {
    console.error('Get hint error:', error);
    res.status(500).json({ message: 'Server error while fetching hint' });
  }
});

// Get team progress
router.get('/progress/:teamId', verifyTeamToken, async (req, res) => {
  try {
    const team = req.team;

    res.json({
      success: true,
      progress: {
        teamId: team.teamId,
        teamName: team.teamName,
        currentRound: team.currentRound,
        currentStep: team.currentStep,
        totalAttempts: team.totalAttempts,
        completedSteps: team.completedSteps,
        lastActivity: team.lastActivity
      }
    });

  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ message: 'Server error while fetching progress' });
  }
});

module.exports = router;
