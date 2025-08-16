# 🚀 E-Week 2025 Game Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
# Install server dependencies
cd eweek-2025/server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Create Environment File
```bash
# Copy the environment template
cd eweek-2025/server
cp env.txt .env
```

Then edit the `.env` file with your actual values:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/your_database
PORTAL_BASE_URL=https://portal.dlsl.edu.ph
REG_KEY=20250813U60HB0
INSECURE_TLS=true
USERNAME_STRATEGY=dot
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,*
MAX_ATTEMPTS=3
```

### 3. Run the Application

**Terminal 1 - Start the Server:**
```bash
cd eweek-2025/server
npm run dev
```

**Terminal 2 - Start the Client:**
```bash
cd eweek-2025/client
npm run dev
```

### 4. Access the Application
- **Game**: http://localhost:5173
- **Server API**: http://localhost:5000

## What's Included

✅ **Complete DLSL API Integration** - No need for separate dlsl-student-api  
✅ **Real Student Lookup** - Connects to actual DLSL Portal  
✅ **Fallback Data** - Works even if DLSL API is down  
✅ **Single Attempt** - One chance per session (no retry button)  
✅ **Welcome Message** - Personalized greeting with student name  
✅ **Leaderboard System** - Best scores tracking from MongoDB  
✅ **MongoDB Integration** - Persistent data storage  

## New Game Flow

1. **QR Code Scan** → Game URL
2. **Student ID Entry** → Enter student number
3. **Welcome Message** → "Welcome, [Name]!" 
4. **Mechanics** → Game instructions
5. **Gameplay** → Stacking game (one attempt)
6. **Results** → Score saved to MongoDB, leaderboard updated
7. **Session Complete** → Must scan QR code again

## Test Student IDs

For testing (when DLSL API is unavailable):
- `2022336001` → John Doe Smith
- `2022336002` → Jane Marie Garcia  
- `2022336003` → Michael James Rodriguez
- `2022336004` → Drexler Reyes

## API Endpoints

All endpoints run on port 5000:
- `POST /api/username` - Student lookup
- `POST /api/scores` - Save game score
- `GET /api/leaderboard` - Get leaderboard
- `GET /api/student-status/:studentId/:sessionId` - Check attempts

## Troubleshooting

### Port Already in Use
If you get "port already in use" errors:
```bash
# Check what's using the port
netstat -ano | findstr :5000

# Kill the process or change PORT in .env
```

### MongoDB Connection Issues
- Verify your MongoDB Atlas connection string
- Check if your IP is whitelisted in MongoDB Atlas
- Ensure the database exists

### DLSL API Issues
- The system will automatically fall back to test data
- Check your REG_KEY and PORTAL_BASE_URL in .env
- Verify INSECURE_TLS=true if having SSL issues

## Development Workflow

1. **Server**: `cd server && npm run dev` (auto-restarts on changes)
2. **Client**: `cd client && npm run dev` (hot reload)
3. **Test**: Use the test student IDs above
4. **Deploy**: Follow DEPLOYMENT.md for production setup

## File Structure

```
eweek-2025/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Game components
│   │   │   ├── StudentIdInput.jsx    # Student ID entry
│   │   │   ├── WelcomeMessage.jsx    # Welcome screen
│   │   │   ├── Mechanics.jsx         # Game instructions
│   │   │   ├── StackGame.jsx         # Main game
│   │   │   └── Results.jsx           # Results & leaderboard
│   │   ├── config.js       # API configuration
│   │   └── Game.jsx        # Main game logic
├── server/                 # Express backend
│   ├── models/             # Database models
│   ├── portalClient.js     # DLSL API integration
│   ├── username.js         # Name/username utilities
│   ├── server.js           # Main server file
│   └── env.txt             # Environment template
└── docs/                   # Documentation
```

## Key Features

### For Students
- ✅ Simple student number entry
- ✅ Personalized welcome message
- ✅ One attempt per session
- ✅ Clear game instructions
- ✅ Real-time leaderboard

### For Administrators
- ✅ Student attempt tracking
- ✅ Session management
- ✅ Enhanced leaderboard from MongoDB
- ✅ Best score per student
- ✅ Deployment ready

Everything is now self-contained in the eweek-2025 folder! 🎉
