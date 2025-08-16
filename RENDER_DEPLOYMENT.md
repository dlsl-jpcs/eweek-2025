# Render Deployment Guide

This guide explains how to deploy your booth game to Render with separate frontend and backend services.

## 🚀 **Deployment Strategy**

We're deploying to **two separate Render services**:
1. **Backend Service** - Node.js API server
2. **Frontend Service** - React static site

## 📋 **Prerequisites**

- GitHub repository with your code
- Render account
- MongoDB Atlas database

## 🔧 **Step 1: Backend Service**

### **Create New Web Service**
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:

**Basic Settings:**
- **Name**: `jpcs-booth-game-backend`
- **Root Directory**: `server`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Environment Variables:**
```
NODE_ENV=production
MONGO_URI=your_mongodb_atlas_connection_string
DLSL_REG_KEY=20250813U60HB0
PORT=10000
```

## 🌐 **Step 2: Frontend Service**

### **Create New Static Site**
1. Click **"New +"** → **"Static Site"**
2. Connect the same GitHub repository
3. Configure the service:

**Basic Settings:**
- **Name**: `jpcs-booth-game-frontend`
- **Root Directory**: `client`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`

**Environment Variables:**
```
VITE_BACKEND_URL=https://jpcs-booth-game-backend.onrender.com
```

## 🔄 **Step 3: Update Backend CORS**

After deploying the frontend, update the backend CORS configuration in `server/server.js`:

```javascript
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://jpcs-booth-game-frontend.onrender.com', 'http://localhost:3000']
    : true,
  credentials: true,
  optionsSuccessStatus: 200
};
```

## 🌍 **Step 4: Test Your Deployment**

1. **Backend URL**: `https://jpcs-booth-game-backend.onrender.com`
2. **Frontend URL**: `https://jpcs-booth-game-frontend.onrender.com`

## 📱 **Step 5: Share with Friends**

Your friends can now access the game at:
`https://jpcs-booth-game-frontend.onrender.com`

## 🔍 **Troubleshooting**

### **Common Issues:**

1. **CORS Errors**: Make sure backend CORS includes frontend URL
2. **Build Failures**: Check that all dependencies are in package.json
3. **Environment Variables**: Ensure all required variables are set in Render

### **Check Logs:**
- Backend: Render Dashboard → Your Service → Logs
- Frontend: Render Dashboard → Your Service → Logs

## 🎯 **Benefits of This Setup:**

- ✅ **Better Performance** - Frontend served from CDN
- ✅ **Independent Scaling** - Scale backend for API load
- ✅ **Professional Structure** - Industry-standard deployment
- ✅ **Easy Updates** - Update one service without affecting the other
- ✅ **Better Monitoring** - Separate logs and metrics

## 📞 **Support**

If you encounter issues:
1. Check Render logs
2. Verify environment variables
3. Test API endpoints directly
4. Check CORS configuration
