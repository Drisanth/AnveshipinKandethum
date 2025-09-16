const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Currently unused, but retained in case you need hashed passwords later
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const Team = require('./models/Team');
const TeamRound = require('./models/TeamRound');
const Admin = require('./models/Admin');

// Sample teams data
const sampleTeams = [
    { teamId: '16146', teamName: 'Alpha Squad' },
    { teamId: '48250', teamName: 'Beta Warriors' },
    { teamId: '45264', teamName: 'Gamma Explorers' },
    { teamId: '97448', teamName: 'Delta Force' },
    { teamId: '98603', teamName: 'Echo Team' },
    { teamId: '21621', teamName: 'Falcon Hunters' },
    { teamId: '38986', teamName: 'Shadow Ninjas' },
    { teamId: '45575', teamName: 'Iron Titans' },
    { teamId: '50161', teamName: 'Crimson Blades' },
    { teamId: '99707', teamName: 'Silver Hawks' },
    { teamId: '80101', teamName: 'Thunder Wolves' },
    { teamId: '62108', teamName: 'Phantom Raiders' },
    { teamId: '41599', teamName: 'Dragon Slayers' },
    { teamId: '19151', teamName: 'Storm Breakers' },
    { teamId: '56742', teamName: 'Night Stalkers' },
    { teamId: '11391', teamName: 'Steel Crushers' },
    { teamId: '77360', teamName: 'Mystic Wizards' },
    { teamId: '65374', teamName: 'Savage Beasts' },
    { teamId: '20846', teamName: 'Venom Vipers' },
    { teamId: '84810', teamName: 'Blaze Riders' },
    { teamId: '15131', teamName: 'Rapid Strikers' },
    { teamId: '34047', teamName: 'Ghost Troopers' },
    { teamId: '35585', teamName: 'Cyber Spartans' },
    { teamId: '96118', teamName: 'Dark Panthers' },
    { teamId: '40974', teamName: 'Inferno Squad' },
    { teamId: '62257', teamName: 'Omega Rangers' },
    { teamId: '30434', teamName: 'War Hawks' },
    { teamId: '66194', teamName: 'Tornado Blitz' },
    { teamId: '37555', teamName: 'Ice Breakers' },
    { teamId: '66916', teamName: 'Venus Guardians' },
    { teamId: '79558', teamName: 'Solar Sparks' },
    { teamId: '20483', teamName: 'Lunar Legends' },
    { teamId: '81898', teamName: 'Galaxy Defenders' },
    { teamId: '68636', teamName: 'Nova Strikers' },
    { teamId: '13906', teamName: 'Eclipse Raiders' }
];

const perTeamRounds = {
    '16146': [
        {
            roundNumber: 0,
            clueType: 'image',
            clueContent: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhizKq26tefaU_2E5boucWXCRnCYi5AN-zqvkPpHeV_FYzDcnbeTKoVRkvMrixPrZvHttKOpRz4cJzz2rcn9cPbQGBW2OPVi_Q2haoeWu0XfGH9TUy5lUDkQoRi6hQaa_jsMZVfBlt105FDoWSttK46a91Qp4Fbu8g_wpj_Lnw5JF7QGGGm68jICbjs15Ye/s1600/WhatsApp%20Image%202025-09-16%20at%2022.55.28_ab52ca29.jpg',
            validationSteps: [
                {
                    stepNumber: 0,
                    inputType: 'text',
                    acceptedAnswers: ['banana', 'Banana', 'BANANA'],
                    additionalClue: 'Correct! Proceed to Main Building(MG).',
                    additionalClueType: 'text'
                }
            ],
            hint: 'Look closely at the image'
        },
        {
            roundNumber: 1,
            clueType: 'text',
            clueContent: 'എനിക്ക് കാലുകൾ ഇല്ലെങ്കിലും ഞാൻ എപ്പോഴും നൃത്തം ചെയ്യും.',
            validationSteps: [
                {
                    stepNumber: 0,
                    inputType: 'text',
                    acceptedAnswers: ['7', 'Seven', 'seven', 'SEVEN'],
                    additionalClue: 'Good progress.',
                    additionalClueType: 'text'
                }
            ],
            hint: 'Look outside MG'
        },
        {
            roundNumber: 2,
            clueType: 'text',
            clueContent: 'ഒരേ മേശയിൽ ചിരിയും പഠനവും പങ്കിടുന്നവർ,ഒരേ സ്വപ്നങ്ങൾക്ക് വഴികാട്ടികൾ. വർഷങ്ങൾ കഴിഞ്ഞാലും ഓർമ്മയായി നിലനിൽക്കുന്ന ബന്ധം…എന്താണ് അവ',
            validationSteps: [
                {
                    stepNumber: 0,
                    inputType: 'text',
                    acceptedAnswers: ['classmate', 'classmates', 'Classmate', 'Classmates'],
                    additionalClue: 'Good going guys. Head to -- .- .. -. ....... -.-. .- -. - . . -.',
                    additionalClueType: 'text'
                }
            ],
            hint: 'Go to 2 1 12 1 10 9'
        },
        {
            roundNumber: 3,
            clueType: 'text',
            clueContent: "-- .- .. -. ....... -.-. .- -. - . . -. \n1. How many 'Smile You're on Camera' are there?\n2. Colour of “SINGLE USE PLASTIC FREE CAMPUS?”\n3. \"Transportation Engineering Laboratory” classroom number?\n4. What is the taxi service name?",
            validationSteps: [
                {
                    stepNumber: 0,
                    inputType: 'text',
                    acceptedAnswers: ['2', 'Two', 'two', '02'],
                    additionalClue: 'Great!',
                    additionalClueType: 'text'
                },
                {
                    stepNumber: 1,
                    inputType: 'text',
                    acceptedAnswers: ['green', 'Green', 'GREEN'],
                    additionalClue: 'Great!',
                    additionalClueType: 'text'
                },
                {
                    stepNumber: 2,
                    inputType: 'text',
                    acceptedAnswers: ['G28', 'G 28', 'g28', 'g 28'],
                    additionalClue: 'Great!',
                    additionalClueType: 'text'
                },
                {
                    stepNumber: 3,
                    inputType: 'text',
                    acceptedAnswers: ['reva journeys', 'Reva Journeys', 'Reva journeys', 'reva Journeys', 'REVA JOURNEYS'],
                    additionalClue: 'Great!',
                    additionalClueType: 'text'
                }
            ],
            hint: 'All answers are visible around the campus'
        },
        {
            roundNumber: 4,
            clueType: 'image',
            clueContent: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj5usBhA8zgBDaXjp_GOh72chMPo32OTf7swM_sDEvadzIQJLBiZibl5Di5_7GCK_lUoVHDN_TQK5a1yHfhmlIZay3VL-TOaCGo6yO439xJX2MOZO2ILslcCTGY4kHim2b5rfhRbQ4ugDt8qC86w5jRG13VdWYsUzZehJyu_CYscDR3lf4v9Wz5_kbA3cfJ/s1600/prp.png',
            validationSteps: [
                {
                    stepNumber: 0,
                    inputType: 'text',
                    acceptedAnswers: ['wish', 'Wish', 'WISH'],
                    additionalClue: 'Correct!.',
                    additionalClueType: 'text'
                }
            ],
            hint: 'Look closely at the image'
        },
        {
            roundNumber: 5,
            clueType: 'text',
            clueContent: 'Head to Greenos. Hurry!!',
            validationSteps: [
                {
                    stepNumber: 0,
                    inputType: 'text',
                    acceptedAnswers: ['667766'],
                    additionalClue: 'Correct!.',
                    additionalClueType: 'text'
                }
            ],
            hint: 'https://goo.gl/maps/3mX4g7b1v8z28ohkhuguhgjgbjryrt5 mkhyg'
        },
    ]
};
async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/puzzle-challenge');
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await Team.deleteMany({});
        await TeamRound.deleteMany({});
        await Admin.deleteMany({});
        console.log('🧹 Cleared existing data');

        // Create admin user
        const admin = new Admin({
            username: process.env.ADMIN_USERNAME || 'admin',
            password: process.env.ADMIN_PASSWORD || 'admin123',
            role: 'admin'
        });
        await admin.save();
        console.log('👑 Created admin user');

        // Create teams
        const createdTeams = [];
        for (const teamData of sampleTeams) {
            const team = new Team(teamData);
            await team.save();
            createdTeams.push(team);
            console.log(`✅ Created team: ${team.teamId} - ${team.teamName}`);
        }

        // Create team rounds
        for (const team of createdTeams) {
            const teamRounds = perTeamRounds[team.teamId];
            if (!teamRounds || teamRounds.length === 0) {
                console.warn(`⚠️ No rounds defined for team ${team.teamId}. Skipping.`);
                continue;
            }

            for (const roundData of teamRounds) {
                const teamRound = new TeamRound({
                    ...roundData,
                    teamId: team.teamId
                });
                await teamRound.save();
                console.log(`🧩 Created round ${roundData.roundNumber} for team ${team.teamId}`);
            }
        }

        console.log('🎉 Database seeded successfully!');
    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        await mongoose.connection.close();
        console.log('🔒 Database connection closed');
    }
}

// Run seed if this file is executed directly
if (require.main === module) {
    seedDatabase();
}

module.exports = seedDatabase;
