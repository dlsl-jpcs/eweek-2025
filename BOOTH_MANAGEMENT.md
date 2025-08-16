# Booth Management System

This system ensures that students must physically come to your booth and scan a QR code to play the game, preventing them from simply refreshing the website or sharing URLs.

## How It Works

1. **Booth staff generates a new QR code** for each play session
2. **Students scan the QR code** to access the game
3. **Once used, the QR code becomes invalid** and they need a new one
4. **This forces students to return to the booth** for each play session

## Setup Instructions

### 1. Environment Variables
Add these to your `.env` file:
```
BOOTH_PASSWORD=booth2025
GAME_URL=https://your-deployed-game-url.com
```

### 2. Access Booth Management
Navigate to `/admin` on your deployed website to access the booth management dashboard.

### 3. Login
Use the password: `booth2025` (or whatever you set in BOOTH_PASSWORD)

## Daily Operations

### Generating QR Codes
1. **Login to the booth dashboard** at `/admin`
2. **Click "Generate New QR Code"**
3. **Copy the generated URL** and create a QR code using any QR code generator
4. **Display the QR code** at your booth

### Managing Sessions
- **Active sessions** are shown in green
- **Used sessions** are shown in gray
- **Sessions expire after 30 minutes** automatically
- **Each QR code can only be used once**

### Best Practices
1. **Generate a new QR code** every 30 minutes or when you notice high traffic
2. **Keep the booth dashboard open** to monitor active sessions
3. **Have multiple QR codes ready** for busy periods
4. **Explain the system to students** so they understand they need to scan each time

## Technical Details

### Session Lifecycle
1. **Created**: When booth staff generates a new QR code
2. **Active**: Available for students to scan and use
3. **Used**: After a student successfully accesses the game
4. **Expired**: After 30 minutes (automatic cleanup)

### Security Features
- **One-time use**: Each QR code can only be used once
- **Time-limited**: Sessions expire after 30 minutes
- **Booth authentication**: Only authorized staff can generate QR codes
- **Session validation**: Server validates each session before allowing game access

## Troubleshooting

### Common Issues
1. **"Session not found"**: QR code has expired or was already used
2. **"Session has expired"**: QR code is older than 30 minutes
3. **"Session has been used"**: Someone already used this QR code

### Solutions
- Generate a new QR code
- Check the booth dashboard for session status
- Ensure students are scanning the current QR code

## Benefits

✅ **Forces booth traffic**: Students must physically come to your booth
✅ **Prevents URL sharing**: Each QR code is unique and time-limited
✅ **Encourages repeat visits**: Students need new QR codes for each play
✅ **Easy management**: Simple dashboard for booth staff
✅ **Automatic cleanup**: Expired sessions are automatically removed

This system ensures maximum booth engagement while maintaining a smooth user experience for students who follow the proper process.
