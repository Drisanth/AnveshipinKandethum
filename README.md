# Team-Based Puzzle Challenge Webapp (MERN Stack)

A mobile-first, modern, dynamic web application for managing team-based puzzle challenges with multiple rounds, validation steps, and an admin panel.

## 🚀 Features

### Team Features
- **Team Login**: Simple team ID-based authentication
- **6 Rounds**: Progressive puzzle challenges (0-5)
- **Multiple Validation Steps**: Each round can have multiple answer validations
- **Multiple Acceptable Answers**: Case-insensitive answer matching
- **Hints System**: Round-specific hints available via info button
- **Progress Tracking**: Automatic progress saving and resumption
- **Rules Modal**: Interactive rules explanation on first login
- **10-Second Delay**: Enforced delay before proceeding to next round
- **Final Code Entry**: Round 5 completion with volunteer code

### Admin Features
- **Admin Dashboard**: Complete team management interface
- **Team Management**: Create, view, update, and delete teams
- **Progress Control**: Reset or modify team progress
- **Round Management**: Edit round data, clues, and validation steps
- **Analytics**: Team performance metrics and progress visualization
- **Real-time Updates**: Live progress tracking

### Technical Features
- **Mobile-First Design**: Responsive UI optimized for mobile devices
- **JWT Authentication**: Secure token-based authentication
- **MongoDB Integration**: Flexible document-based data storage
- **RESTful API**: Clean API design with proper error handling
- **TypeScript**: Type-safe frontend development
- **Modern React**: Hooks, functional components, context API

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests

### Frontend
- **React 18** with TypeScript
- **React Router** for navigation
- **Axios** for API calls
- **Context API** for state management
- **CSS Modules** for styling (no Tailwind)

### Database
- **MongoDB Atlas** (cloud) or local MongoDB
- **Collections**: teams, team_rounds, admins

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment Configuration**:
   ```bash
   cp env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/puzzle-challenge
   JWT_SECRET=your-super-secret-jwt-key-here
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin123
   PORT=5000
   NODE_ENV=development
   ```

3. **Seed the database**:
   ```bash
   node backend/seed.js
   ```

4. **Start the backend server**:
   ```bash
   npm run server
   ```

### Frontend Setup

1. **Install dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Environment Configuration**:
   ```bash
   cp env.example .env
   ```
   
   Update `.env`:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

3. **Start the frontend**:
   ```bash
   npm start
   ```

### Full Development Setup

Run both frontend and backend simultaneously:
```bash
npm run dev
```

## 🎮 Usage

### Team Login
1. Navigate to the application
2. Enter your Team ID (e.g., TEAM001)
3. Accept the rules modal
4. Start solving puzzles!

### Admin Access
1. Go to `/admin/login`
2. Use credentials: `admin` / `admin123`
3. Manage teams, rounds, and view analytics

### Sample Teams
The seed script creates these teams:
- TEAM001 - Alpha Squad
- TEAM002 - Beta Warriors
- TEAM003 - Gamma Explorers
- TEAM004 - Delta Force
- TEAM005 - Echo Team

## 🗄️ Database Schema

### Teams Collection
```javascript
{
  teamId: String (unique),
  teamName: String,
  currentRound: Number (0-5),
  currentStep: Number,
  completedSteps: Array,
  totalAttempts: Number,
  lastActivity: Date,
  isActive: Boolean
}
```

### Team Rounds Collection
```javascript
{
  teamId: String,
  roundNumber: Number (0-5),
  clueType: String ('text' | 'image'),
  clueContent: String,
  validationSteps: Array,
  hint: String,
  isActive: Boolean
}
```

### Admins Collection
```javascript
{
  username: String (unique),
  password: String (hashed),
  role: String ('admin' | 'superadmin'),
  isActive: Boolean,
  lastLogin: Date
}
```

## 🚀 Deployment

### Backend Deployment (Heroku/Railway)

1. **Create a new app** on Heroku or Railway
2. **Set environment variables**:
   ```
   MONGODB_URI=your-mongodb-atlas-connection-string
   JWT_SECRET=your-production-jwt-secret
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your-secure-password
   NODE_ENV=production
   ```

3. **Deploy**:
   ```bash
   git push heroku main
   ```

### Frontend Deployment (Vercel)

1. **Connect your repository** to Vercel
2. **Set build settings**:
   - Build Command: `cd frontend && npm run build`
   - Output Directory: `frontend/build`
   - Install Command: `npm run install-all`

3. **Set environment variables**:
   ```
   REACT_APP_API_URL=https://your-backend-url.herokuapp.com/api
   ```

4. **Deploy** automatically on git push

### MongoDB Atlas Setup

1. **Create a cluster** on MongoDB Atlas
2. **Whitelist IP addresses** (0.0.0.0/0 for development)
3. **Create a database user**
4. **Get connection string** and update `MONGODB_URI`

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - Team login
- `POST /api/auth/admin/login` - Admin login

### Game
- `GET /api/game/round/:teamId` - Get current round
- `POST /api/game/validate` - Validate user input
- `POST /api/game/next` - Move to next round
- `GET /api/game/hint/:teamId/:roundNumber` - Get hint
- `GET /api/game/progress/:teamId` - Get team progress

### Admin
- `GET /api/admin/teams` - List all teams
- `GET /api/admin/team/:teamId` - Get team details
- `POST /api/admin/team/:teamId/update` - Update team progress
- `POST /api/admin/team/:teamId/rounds` - Update round data
- `POST /api/admin/teams` - Create new team
- `DELETE /api/admin/team/:teamId` - Delete team
- `GET /api/admin/analytics` - Get analytics

## 🎨 Customization

### Adding New Rounds
1. Use the admin panel to edit round data
2. Or modify the seed script and re-run it
3. Each round supports multiple validation steps

### Styling
- All styles are in CSS files (no Tailwind)
- Mobile-first responsive design
- Custom CSS variables for easy theming

### Validation Logic
- Case-insensitive matching
- Multiple acceptable answers per step
- Trimmed input validation

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**:
   - Check your `MONGODB_URI`
   - Ensure MongoDB is running (if local)
   - Verify Atlas connection string

2. **CORS Issues**:
   - Check backend CORS configuration
   - Verify frontend API URL

3. **Authentication Issues**:
   - Clear localStorage and try again
   - Check JWT secret configuration

4. **Build Issues**:
   - Run `npm run install-all` to install all dependencies
   - Check Node.js version compatibility

## 📝 License

MIT License - feel free to use this project for your events!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Create an issue in the repository

---

**Happy Puzzle Solving! 🧩**
