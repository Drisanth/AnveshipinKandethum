const express = require('express');
const jwt = require('jsonwebtoken');
const Team = require('../models/Team');
const Admin = require('../models/Admin');
const { verifyAdminToken } = require('../middleware/auth');

const router = express.Router();

// Team login
router.post('/login', async (req, res) => {
  try {
    const { teamId } = req.body;

    if (!teamId) {
      return res.status(400).json({ message: 'Team ID is required' });
    }

    // Find team
    const team = await Team.findOne({ teamId: teamId.trim(), isActive: true });
    if (!team) {
      return res.status(401).json({ message: 'Invalid team ID' });
    }

    // Update last activity
    team.lastActivity = new Date();
    await team.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        teamId: team.teamId, 
        teamName: team.teamName,
        currentRound: team.currentRound,
        currentStep: team.currentStep,
        type: 'team' 
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      team: {
        teamId: team.teamId,
        teamName: team.teamName,
        currentRound: team.currentRound,
        currentStep: team.currentStep
      },
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Team login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Admin login
router.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Find admin
    const admin = await Admin.findOne({ username: username.trim(), isActive: true });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        username: admin.username, 
        role: admin.role,
        type: 'admin' 
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '8h' }
    );

    res.json({
      success: true,
      token,
      admin: {
        username: admin.username,
        role: admin.role
      },
      message: 'Admin login successful'
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Verify token endpoint
router.get('/verify', verifyAdminToken, (req, res) => {
  res.json({
    success: true,
    user: req.user,
    message: 'Token is valid'
  });
});

module.exports = router;
