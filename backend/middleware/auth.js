const jwt = require('jsonwebtoken');
const Team = require('../models/Team');
const Admin = require('../models/Admin');

// Verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided, access denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Verify team token
const verifyTeamToken = async (req, res, next) => {
  try {
    await verifyToken(req, res, () => {});
    
    if (req.user.type !== 'team') {
      return res.status(403).json({ message: 'Access denied. Team token required.' });
    }
    
    // Verify team still exists and is active
    const team = await Team.findOne({ teamId: req.user.teamId, isActive: true });
    if (!team) {
      return res.status(403).json({ message: 'Team not found or inactive' });
    }
    
    req.team = team;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid team token' });
  }
};

// Verify admin token
const verifyAdminToken = async (req, res, next) => {
  try {
    await verifyToken(req, res, () => {});
    
    if (req.user.type !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin token required.' });
    }
    
    // Verify admin still exists and is active
    const admin = await Admin.findOne({ username: req.user.username, isActive: true });
    if (!admin) {
      return res.status(403).json({ message: 'Admin not found or inactive' });
    }
    
    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid admin token' });
  }
};

module.exports = {
  verifyToken,
  verifyTeamToken,
  verifyAdminToken
};
