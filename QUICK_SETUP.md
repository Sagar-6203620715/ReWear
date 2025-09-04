# ⚡ Quick Setup Guide

This guide helps you quickly set up the essential services needed to deploy ReWear.

## 🗄️ MongoDB Atlas Setup (5 minutes)

### Step 1: Create Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Click "Try Free" and create an account
3. Choose "Free" tier (M0)

### Step 2: Create Cluster
1. Click "Build a Database"
2. Choose "FREE" tier
3. Select a cloud provider (AWS/Google Cloud/Azure)
4. Choose a region close to you
5. Click "Create"

### Step 3: Create Database User
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username and password (save these!)
5. Set privileges to "Read and write to any database"
6. Click "Add User"

### Step 4: Get Connection String
1. Go to "Database" in the left sidebar
2. Click "Connect"
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with `rewear`

**Example connection string:**
```
mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/rewear?retryWrites=true&w=majority
```

## 🖼️ Cloudinary Setup (3 minutes)

### Step 1: Create Account
1. Go to [Cloudinary](https://cloudinary.com/)
2. Click "Sign Up For Free"
3. Create an account

### Step 2: Get Credentials
1. After signing up, you'll see your dashboard
2. Note down:
   - **Cloud Name** (shown in the dashboard)
   - **API Key** (click "Show" to reveal)
   - **API Secret** (click "Show" to reveal)

## 🔧 Environment Files Setup

### Backend Environment File
Create `backend/.env`:

```env
# Server Configuration
PORT=9000
NODE_ENV=production

# Database Configuration
MONGO_URI=mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/rewear?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random_at_least_32_characters

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Frontend URL (update after deployment)
FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend Environment File
Create `frontend/.env`:

```env
# Backend API URL (update after backend deployment)
VITE_BACKEND_URL=https://your-backend-domain.com
```

## 🚀 Quick Deployment Commands

### For Render + Netlify (Recommended)

1. **Deploy Backend to Render:**
   - Go to [Render](https://render.com)
   - Connect your GitHub repository
   - Set root directory to `backend`
   - Add environment variables
   - Deploy

2. **Deploy Frontend to Netlify:**
   - Go to [Netlify](https://app.netlify.com)
   - Connect your GitHub repository
   - Set root directory to `frontend`
   - Add backend URL to environment
   - Deploy

## 🔍 Test Your Setup

### Test Backend
```bash
curl https://your-backend-url.com/health
```

Expected response:
```json
{
  "status": "ok"
}
```

### Test Frontend
1. Visit your frontend URL
2. Check browser console for errors
3. Try to register/login

## 🚨 Common Issues

### MongoDB Connection Issues
- Check if your IP is whitelisted in MongoDB Atlas
- Verify username/password in connection string
- Ensure database name is correct

### Cloudinary Issues
- Verify cloud name, API key, and secret
- Check if your account is active
- Ensure proper file size limits

### CORS Issues
- Update `FRONTEND_URL` in backend environment
- Redeploy backend after CORS changes
- Check browser console for CORS errors

## 📞 Need Help?

1. Check the detailed `DEPLOYMENT_GUIDE.md`
2. Review `DEPLOYMENT_FIXES.md` for common solutions
3. Check application logs for specific errors
4. Verify all environment variables are set correctly

---

**Time to complete setup: ~10-15 minutes**
