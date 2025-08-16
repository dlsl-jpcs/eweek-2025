# E-Week 2025 Game Deployment Guide

## Overview
This game now has everything integrated into one project! The DLSL Student API functionality is built into the game server, so you only need to deploy one application. Students scan a QR code, enter their student number, and play the stacking game.

## Features
- **Integrated System**: DLSL Student API + Game Server + Client all in one project
- Student ID input with automatic name fetching
- 3-attempt limit per session
- Session management with unique session IDs
- Leaderboard with best scores per student
- Responsive design for mobile and desktop

## Prerequisites
1. **MongoDB Atlas** database connection
2. **Render** account for deployment
3. **GitHub** repository for your project

## Deployment Steps

### 1. Deploy E-Week Game to Render
1. Push your `eweek-2025` project to GitHub
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Set environment variables:
   - `MONGO_URI=your_mongodb_atlas_connection_string`
   - `NODE_ENV=production`
   - `PORT=5000`
5. Set build command: `cd client && npm install && npm run build`
6. Set start command: `cd server && npm install && npm start`
7. Deploy and note the Render URL

### 2. Update Configuration
1. Update `eweek-2025/client/src/config.js`:
   ```javascript
   production: {
     dlslApiUrl: 'https://your-game-render-url.onrender.com',
     gameApiUrl: 'https://your-game-render-url.onrender.com'
   }
   ```

### 3. Customize Student Data (Optional)
If you want to connect to your actual DLSL database instead of using mock data:
1. Update the `/api/username` endpoint in `server/server.js`
2. Replace the mock data with your actual database connection
3. Update the student lookup logic

## Environment Variables

### E-Week Game Server (.env)
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
NODE_ENV=production
PORT=5000
```

## Game Flow
1. **QR Code Scan**: Student scans QR code leading to game URL
2. **Student ID Entry**: Student enters their student number
3. **Name Fetching**: Game fetches student name from integrated API
4. **Mechanics**: Student sees game instructions with attempt counter
5. **Gameplay**: Student plays the stacking game
6. **Results**: Score is saved, leaderboard is updated
7. **Replay**: Student can play up to 3 times per session
8. **Session Expiry**: After 3 attempts, student must scan QR code again

## API Endpoints

### Integrated API (All on port 5000)
- `POST /api/username` - Fetch student information by student ID
- `POST /api/scores` - Save game score
- `GET /api/leaderboard` - Get top scores
- `GET /api/student-status/:studentId/:sessionId` - Check student attempt status

## Database Schema
```javascript
{
  studentId: String,    // Student's ID number
  name: String,         // Student's display name
  score: Number,        // Game score
  attempts: Number,     // Number of attempts in this session
  sessionId: String,    // Unique session identifier
  createdAt: Date       // Timestamp
}
```

## Testing

### Local Testing
1. Start Game Server: `cd eweek-2025/server && npm run dev`
2. Start Game Client: `cd eweek-2025/client && npm run dev`
3. Run Integration Test: `cd eweek-2025 && node test-integration.js`

### Test Scenarios
- ✅ Student ID entry with valid ID (2022336001, 2022336002, 2022336003)
- ✅ Student ID entry with invalid ID
- ✅ Game completion and score saving
- ✅ Attempt tracking (1st, 2nd, 3rd)
- ✅ Session expiry after 3 attempts
- ✅ Leaderboard updates

## Troubleshooting

### Common Issues
1. **Port Conflicts**: Ensure no other service is using port 5000
2. **Database Connection**: Check MongoDB Atlas connection string and network access
3. **Build Errors**: Ensure all dependencies are in `package.json`
4. **API Errors**: Check server logs for detailed error messages

### Testing
1. Test locally with the integrated server
2. Test with deployed version
3. Verify mobile responsiveness
4. Test all API endpoints

## Security Considerations
1. **Rate Limiting**: Consider implementing rate limiting on API endpoints
2. **Input Validation**: Student IDs are validated on both client and server
3. **Session Management**: Unique session IDs prevent attempt manipulation
4. **Environment Variables**: Keep sensitive data in environment variables

## Monitoring
1. **Render Logs**: Monitor application logs for errors
2. **Database**: Monitor MongoDB Atlas for connection issues
3. **API Health**: All endpoints are now in one place
4. **Performance**: Monitor response times and error rates

## Benefits of Integration
- ✅ **Single Deployment**: Only one service to deploy and maintain
- ✅ **Simplified Architecture**: No need to manage multiple servers
- ✅ **Easier Testing**: All functionality in one place
- ✅ **Cost Effective**: Single Render service instead of multiple
- ✅ **Simplified CORS**: No cross-origin issues between APIs
