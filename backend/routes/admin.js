const express = require('express');
const Team = require('../models/Team');
const TeamRound = require('../models/TeamRound');
const Admin = require('../models/Admin');
const { verifyAdminToken } = require('../middleware/auth');

const router = express.Router();

// Get all teams and their progress
router.get('/teams', verifyAdminToken, async (req, res) => {
  try {
    const teams = await Team.find({ isActive: true })
      .select('teamId teamName currentRound currentStep totalAttempts lastActivity')
      .sort({ currentRound: -1, currentStep: -1 });

    res.json({
      success: true,
      teams: teams
    });

  } catch (error) {
    console.error('Get teams error:', error);
    res.status(500).json({ message: 'Server error while fetching teams' });
  }
});

// Get specific team details and round data
router.get('/team/:teamId', verifyAdminToken, async (req, res) => {
  try {
    const { teamId } = req.params;

    const team = await Team.findOne({ teamId: teamId, isActive: true });
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Get all rounds for this team
    const rounds = await TeamRound.find({ teamId: teamId })
      .sort({ roundNumber: 1 });

    res.json({
      success: true,
      team: team,
      rounds: rounds
    });

  } catch (error) {
    console.error('Get team details error:', error);
    res.status(500).json({ message: 'Server error while fetching team details' });
  }
});

// Update team progress
router.post('/team/:teamId/update', verifyAdminToken, async (req, res) => {
  try {
    const { teamId } = req.params;
    const { currentRound, currentStep, resetProgress } = req.body;

    const team = await Team.findOne({ teamId: teamId, isActive: true });
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (resetProgress) {
      // Reset team progress
      team.currentRound = 0;
      team.currentStep = 0;
      team.completedSteps = [];
      team.totalAttempts = 0;
    } else {
      // Update specific progress
      if (currentRound !== undefined) {
        team.currentRound = Math.max(0, Math.min(5, currentRound));
      }
      if (currentStep !== undefined) {
        team.currentStep = Math.max(0, currentStep);
      }
    }

    team.lastActivity = new Date();
    await team.save();

    res.json({
      success: true,
      message: 'Team progress updated successfully',
      team: {
        teamId: team.teamId,
        teamName: team.teamName,
        currentRound: team.currentRound,
        currentStep: team.currentStep,
        totalAttempts: team.totalAttempts
      }
    });

  } catch (error) {
    console.error('Update team progress error:', error);
    res.status(500).json({ message: 'Server error while updating team progress' });
  }
});

// Add or update rounds data for a team
router.post('/team/:teamId/rounds', verifyAdminToken, async (req, res) => {
  try {
    const { teamId } = req.params;
    const { roundNumber, clueType, clueContent, validationSteps, hint } = req.body;

    if (!roundNumber || !clueType || !clueContent || !validationSteps || !hint) {
      return res.status(400).json({ 
        message: 'All fields are required: roundNumber, clueType, clueContent, validationSteps, hint' 
      });
    }

    // Validate round number
    if (roundNumber < 0 || roundNumber > 5) {
      return res.status(400).json({ message: 'Round number must be between 0 and 5' });
    }

    // Validate validation steps
    if (!Array.isArray(validationSteps) || validationSteps.length === 0) {
      return res.status(400).json({ message: 'Validation steps must be a non-empty array' });
    }

    // Check if team exists
    const team = await Team.findOne({ teamId: teamId, isActive: true });
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Create or update round data
    const roundData = {
      teamId: teamId,
      roundNumber: roundNumber,
      clueType: clueType,
      clueContent: clueContent,
      validationSteps: validationSteps,
      hint: hint
    };

    const updatedRound = await TeamRound.findOneAndUpdate(
      { teamId: teamId, roundNumber: roundNumber },
      roundData,
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      message: 'Round data updated successfully',
      round: updatedRound
    });

  } catch (error) {
    console.error('Update rounds error:', error);
    res.status(500).json({ message: 'Server error while updating rounds data' });
  }
});

// Create a new team
router.post('/teams', verifyAdminToken, async (req, res) => {
  try {
    const { teamId, teamName } = req.body;

    if (!teamId || !teamName) {
      return res.status(400).json({ message: 'Team ID and team name are required' });
    }

    // Check if team already exists
    const existingTeam = await Team.findOne({ teamId: teamId });
    if (existingTeam) {
      return res.status(400).json({ message: 'Team with this ID already exists' });
    }

    const team = new Team({
      teamId: teamId.trim(),
      teamName: teamName.trim()
    });

    await team.save();

    res.json({
      success: true,
      message: 'Team created successfully',
      team: {
        teamId: team.teamId,
        teamName: team.teamName,
        currentRound: team.currentRound,
        currentStep: team.currentStep
      }
    });

  } catch (error) {
    console.error('Create team error:', error);
    res.status(500).json({ message: 'Server error while creating team' });
  }
});

// Delete a team
router.delete('/team/:teamId', verifyAdminToken, async (req, res) => {
  try {
    const { teamId } = req.params;

    const team = await Team.findOneAndUpdate(
      { teamId: teamId },
      { isActive: false },
      { new: true }
    );

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.json({
      success: true,
      message: 'Team deactivated successfully'
    });

  } catch (error) {
    console.error('Delete team error:', error);
    res.status(500).json({ message: 'Server error while deleting team' });
  }
});

// Get analytics
router.get('/analytics', verifyAdminToken, async (req, res) => {
  try {
    const totalTeams = await Team.countDocuments({ isActive: true });
    const teamsByRound = await Team.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$currentRound', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    const totalAttempts = await Team.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, total: { $sum: '$totalAttempts' } } }
    ]);

    res.json({
      success: true,
      analytics: {
        totalTeams: totalTeams,
        teamsByRound: teamsByRound,
        totalAttempts: totalAttempts[0]?.total || 0
      }
    });

  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Server error while fetching analytics' });
  }
});

module.exports = router;
