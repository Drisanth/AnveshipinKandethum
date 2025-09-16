const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const Team = require('./models/Team');
const TeamRound = require('./models/TeamRound');
const Admin = require('./models/Admin');

// Sample teams data
const sampleTeams = [
  { teamId: 'TEAM001', teamName: 'Alpha Squad' },
  { teamId: 'TEAM002', teamName: 'Beta Warriors' },
  { teamId: 'TEAM003', teamName: 'Gamma Explorers' },
  { teamId: 'TEAM004', teamName: 'Delta Force' },
  { teamId: 'TEAM005', teamName: 'Echo Team' }
];

// Default rounds data used when a team does not have custom configuration
const defaultRounds = [
  {
    roundNumber: 0,
    clueType: 'text',
    clueContent: 'Welcome to the puzzle challenge! Your first clue is: "The beginning of everything, the end of time."',
    validationSteps: [
      {
        stepNumber: 0,
        inputType: 'text',
        acceptedAnswers: ['E', 'e'],
        additionalClue: 'Great! Now look around you for the next clue.',
        additionalClueType: 'text'
      }
    ],
    hint: 'Think about the alphabet and what comes first.'
  },
  {
    roundNumber: 1,
    clueType: 'text',
    clueContent: 'Find the hidden message in this text: "The quick brown fox jumps over the lazy dog."',
    validationSteps: [
      {
        stepNumber: 0,
        inputType: 'text',
        acceptedAnswers: ['pangram', 'Pangram', 'PANGRAM'],
        additionalClue: 'Excellent! This sentence contains every letter of the alphabet.',
        additionalClueType: 'text'
      }
    ],
    hint: 'This sentence is famous for containing all letters of the alphabet.'
  },
  {
    roundNumber: 2,
    clueType: 'image',
    clueContent: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhlHwDHYOeG80QZGEVoh17NSx3CuXB0Mc9zvylJ-mSUtAvetuY-ra_nZ6cYI6195PHVx28YMvfZq3QaHfIFeVaHeTFsXK3ynDzmCFeFEA7oEQgQX5jsSngs-665vnP86TLtj65gn-NOhE0q/s1600/ban.jpg',
    validationSteps: [
      {
        stepNumber: 0,
        inputType: 'text',
        acceptedAnswers: ['ban', 'banned', 'no entry', 'prohibited'],
        additionalClue: 'Good spot! Interpret the sign and move forward.',
        additionalClueType: 'text'
      }
    ],
    hint: 'Observe the image carefully and think of the word it represents.'
  },
  {
    roundNumber: 3,
    clueType: 'text',
    clueContent: 'Answer these 4 questions: 1) What is 5+5? 2) What color is the sky? 3) How many days in a week? 4) What is the capital of France?',
    validationSteps: [
      {
        stepNumber: 0,
        inputType: 'text',
        acceptedAnswers: ['10', 'ten', 'Ten'],
        additionalClue: 'Question 1 correct! Now answer: What color is the sky?',
        additionalClueType: 'text'
      },
      {
        stepNumber: 1,
        inputType: 'text',
        acceptedAnswers: ['blue', 'Blue', 'BLUE'],
        additionalClue: 'Question 2 correct! Now answer: How many days in a week?',
        additionalClueType: 'text'
      },
      {
        stepNumber: 2,
        inputType: 'text',
        acceptedAnswers: ['7', 'seven', 'Seven'],
        additionalClue: 'Question 3 correct! Final question: What is the capital of France?',
        additionalClueType: 'text'
      },
      {
        stepNumber: 3,
        inputType: 'text',
        acceptedAnswers: ['paris', 'Paris', 'PARIS'],
        additionalClue: 'All questions correct! You can proceed to the next round.',
        additionalClueType: 'text'
      }
    ],
    hint: 'Answer each question one by one as they appear.'
  },
  {
    roundNumber: 4,
    clueType: 'text',
    clueContent: 'Decode this message: "Gur zbfg vzcbegnag guvat vf gb or sha."',
    validationSteps: [
      {
        stepNumber: 0,
        inputType: 'text',
        acceptedAnswers: ['the most important thing is to be fun', 'The most important thing is to be fun', 'THE MOST IMPORTANT THING IS TO BE FUN'],
        additionalClue: 'Brilliant! You cracked the code.',
        additionalClueType: 'text'
      }
    ],
    hint: 'This is a simple substitution cipher. Each letter is shifted by 13 positions.'
  },
  {
    roundNumber: 5,
    clueType: 'text',
    clueContent: 'Enter the final code given by the volunteer to complete the challenge!',
    validationSteps: [
      {
        stepNumber: 0,
        inputType: 'code',
        acceptedAnswers: ['FINAL2024', 'final2024', 'Final2024'],
        additionalClue: 'Congratulations! You have completed the challenge!',
        additionalClueType: 'text'
      }
    ],
    hint: 'Ask the volunteer for the final completion code.'
  }
];

// Team-specific rounds overrides. Define per-team, per-round content here.
// Any round not specified for a team will fall back to defaultRounds.
const perTeamRounds = {
  TEAM001: [
    // Override Round 0 for TEAM001
    {
      roundNumber: 0,
      clueType: 'text',
      clueContent: 'Alpha Squad, decode this: I speak without a mouth and hear without ears. What am I?',
      validationSteps: [
        {
          stepNumber: 0,
          inputType: 'text',
          acceptedAnswers: ['echo', 'Echo', 'ECHO'],
          additionalClue: 'Correct! Proceed to the next challenge.',
          additionalClueType: 'text'
        }
      ],
      hint: 'It repeats what it hears.'
    },
    // Keep our image-based round as Round 2
    {
      roundNumber: 2,
      clueType: 'image',
      clueContent: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhlHwDHYOeG80QZGEVoh17NSx3CuXB0Mc9zvylJ-mSUtAvetuY-ra_nZ6cYI6195PHVx28YMvfZq3QaHfIFeVaHeTFsXK3ynDzmCFeFEA7oEQgQX5jsSngs-665vnP86TLtj65gn-NOhE0q/s1600/ban.jpg',
      validationSteps: [
        {
          stepNumber: 0,
          inputType: 'text',
          acceptedAnswers: ['ban', 'banned', 'no entry', 'prohibited'],
          additionalClue: 'Good spot! Interpret the sign and move forward.',
          additionalClueType: 'text'
        }
      ],
      hint: 'Observe the image carefully and think of the word it represents.'
    }
  ],
  TEAM002: [
    // Different Round 1 for TEAM002
    {
      roundNumber: 1,
      clueType: 'text',
      clueContent: 'I have keys but no locks. I have space but no room. You can enter, but can’t go outside. What am I?',
      validationSteps: [
        {
          stepNumber: 0,
          inputType: 'text',
          acceptedAnswers: ['keyboard', 'Keyboard', 'KEYBOARD'],
          additionalClue: 'Nice! On to the next one.',
          additionalClueType: 'text'
        }
      ],
      hint: 'You use it to type.'
    }
  ]
};

// Seed function
async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/puzzle-challenge');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Team.deleteMany({});
    await TeamRound.deleteMany({});
    await Admin.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const admin = new Admin({
      username: process.env.ADMIN_USERNAME || 'admin',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      role: 'admin'
    });
    await admin.save();
    console.log('Created admin user');

    // Create teams
    const createdTeams = [];
    for (const teamData of sampleTeams) {
      const team = new Team(teamData);
      await team.save();
      createdTeams.push(team);
      console.log(`Created team: ${team.teamId} - ${team.teamName}`);
    }

    // Create rounds for each team strictly from per-team definitions (no defaults)
    for (const team of createdTeams) {
      const teamRounds = perTeamRounds[team.teamId];
      if (!teamRounds || teamRounds.length === 0) {
        console.warn(`No rounds defined for team ${team.teamId}. Skipping rounds creation.`);
        continue;
      }

      for (const roundData of teamRounds) {
        const teamRound = new TeamRound({
          ...roundData,
          teamId: team.teamId
        });
        await teamRound.save();
        console.log(`Created round ${roundData.roundNumber} for team ${team.teamId}`);
      }
    }

    console.log('Database seeded successfully!');
    console.log('\nSample login credentials:');
    console.log('Admin: username=admin, password=admin123');
    console.log('Teams: TEAM001, TEAM002, TEAM003, TEAM004, TEAM005');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run seed if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
