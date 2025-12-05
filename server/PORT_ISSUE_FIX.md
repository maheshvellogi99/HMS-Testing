# Fixing Port 5000 Issue on macOS

## Problem
On macOS Monterey (12.0) and later, Apple's **AirPlay Receiver** service uses port 5000 by default, causing conflicts with development servers.

## Error Message
```
Error: listen EADDRINUSE: address already in use :::5000
```

## Solution Options

### Option 1: Change Port in .env File (Recommended)
1. Open `/server/.env`
2. Change `PORT=5000` to `PORT=5001` (or any other available port)
3. Restart your server

### Option 2: Disable AirPlay Receiver (macOS)
1. Open **System Settings** (or System Preferences)
2. Go to **General** → **AirDrop & Handoff**
3. Turn OFF **AirPlay Receiver**

### Option 3: Kill the Process (Temporary)
```bash
# Find process on port 5000
lsof -ti:5000

# Kill the process (replace PID with the actual process ID)
kill -9 <PID>
```

## Updated Configuration
Your `.env` file should look like this:

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/chikitsamitra?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_generated_secret
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

## After Changing Port
Remember to update your frontend API calls to use the new port:
- Old: `http://localhost:5000/api/v1/...`
- New: `http://localhost:5001/api/v1/...`
