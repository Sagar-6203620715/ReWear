# 🚀 ReWear Deployment Guide

This guide will help you deploy your ReWear clothing exchange application to production.

## 📋 Prerequisites

Before deploying, ensure you have:

1. **MongoDB Database** (MongoDB Atlas recommended)
2. **Cloudinary Account** (for image uploads)
3. **GitHub Account** (for code hosting)
4. **Domain Name** (optional, for custom URLs)

## 🎯 Quick Start - Option 1: Vercel (Recommended)

### Step 1: Prepare Your Code

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Create a MongoDB Atlas database**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free cluster
   - Get your connection string

3. **Set up Cloudinary**:
   - Go to [Cloudinary](https://cloudinary.com/)
   - Create a free account
   - Get your cloud name, API key, and API secret

### Step 2: Deploy Backend to Vercel

1. **Go to [Vercel](https://vercel.com)** and sign up with GitHub
2. **Import your repository**
3. **Configure the backend deployment**:
   - Set root directory to: `backend`
   - Build command: `npm install`
   - Output directory: Leave empty
   - Install command: `npm install`

4. **Add Environment Variables**:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/rewear?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   NODE_ENV=production
   ```

5. **Deploy** and note your backend URL (e.g., `https://rewear-backend.vercel.app`)

### Step 3: Deploy Frontend to Vercel

1. **Create a new Vercel project** for the frontend
2. **Import the same repository**
3. **Configure the frontend deployment**:
   - Set root directory to: `frontend`
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install`

4. **Add Environment Variables**:
   ```
   VITE_BACKEND_URL=https://your-backend-url.vercel.app
   ```

5. **Deploy** and note your frontend URL

### Step 4: Update CORS Settings

1. **Go back to your backend Vercel project**
2. **Add the frontend URL to environment variables**:
   ```
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```
3. **Redeploy the backend**

## 🎯 Option 2: Heroku + Netlify

### Backend Deployment (Heroku)

1. **Install Heroku CLI**:
   ```bash
   # Windows
   winget install --id=Heroku.HerokuCLI
   
   # macOS
   brew tap heroku/brew && brew install heroku
   ```

2. **Login to Heroku**:
   ```bash
   heroku login
   ```

3. **Create Heroku app**:
   ```bash
   cd backend
   heroku create rewear-backend
   ```

4. **Set environment variables**:
   ```bash
   heroku config:set MONGO_URI="your_mongodb_connection_string"
   heroku config:set JWT_SECRET="your_jwt_secret"
   heroku config:set CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
   heroku config:set CLOUDINARY_API_KEY="your_cloudinary_api_key"
   heroku config:set CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
   heroku config:set NODE_ENV="production"
   ```

5. **Deploy**:
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

### Frontend Deployment (Netlify)

1. **Go to [Netlify](https://netlify.com)** and sign up
2. **Connect your GitHub repository**
3. **Configure build settings**:
   - Build command: `cd frontend && npm run build`
   - Publish directory: `frontend/dist`
   - Base directory: Leave empty

4. **Add environment variables**:
   ```
   VITE_BACKEND_URL=https://your-heroku-app.herokuapp.com
   ```

5. **Deploy** and get your Netlify URL

6. **Update backend CORS**:
   ```bash
   heroku config:set FRONTEND_URL="https://your-netlify-app.netlify.app"
   ```

## 🎯 Option 3: Railway (Modern Alternative)

### Deploy Both Frontend and Backend

1. **Go to [Railway](https://railway.app)** and sign up with GitHub
2. **Create a new project**
3. **Add two services**:
   - Backend service (point to `backend` directory)
   - Frontend service (point to `frontend` directory)

4. **Configure environment variables** for both services
5. **Deploy** both services

## 🔧 Environment Variables Setup

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=9000
NODE_ENV=production

# Database Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/rewear?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Frontend URL (for CORS)
FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```env
# Backend API URL
VITE_BACKEND_URL=https://your-backend-domain.com
```

## 🗄️ Database Setup

### MongoDB Atlas Setup

1. **Create a MongoDB Atlas account**
2. **Create a new cluster** (free tier is fine)
3. **Create a database user** with read/write permissions
4. **Get your connection string**:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/rewear?retryWrites=true&w=majority
   ```
5. **Replace username, password, and cluster details**

### Seed Initial Data

After deployment, seed your database:

```bash
# For Vercel/Railway
curl -X POST https://your-backend-url.com/api/seed

# For Heroku
heroku run npm run seed
```

## 🖼️ Cloudinary Setup

1. **Create a Cloudinary account**
2. **Get your credentials** from the dashboard:
   - Cloud name
   - API key
   - API secret
3. **Add them to your environment variables**

## 🔍 Testing Your Deployment

### Backend Health Check

```bash
curl https://your-backend-url.com/health
```

Expected response:
```json
{
  "status": "ok"
}
```

### Frontend Health Check

Visit your frontend URL and check the browser console for any errors.

## 🚨 Common Issues & Solutions

### CORS Errors

If you see CORS errors, ensure:
1. Frontend URL is added to backend CORS settings
2. Environment variables are properly set
3. Backend is redeployed after CORS changes

### Database Connection Issues

1. Check MongoDB connection string format
2. Ensure database user has correct permissions
3. Check if IP whitelist is needed (MongoDB Atlas)

### Image Upload Issues

1. Verify Cloudinary credentials
2. Check if Cloudinary account is active
3. Ensure proper file size limits

## 📊 Monitoring & Maintenance

### Health Monitoring

Set up monitoring for:
- Backend health endpoint
- Database connectivity
- Image upload functionality
- User authentication

### Performance Optimization

1. **Enable compression** (already configured)
2. **Use CDN** for static assets
3. **Monitor bundle sizes**
4. **Implement caching strategies**

## 🔒 Security Checklist

- [ ] Environment variables are not in code
- [ ] JWT secret is strong and unique
- [ ] CORS is properly configured
- [ ] HTTPS is enabled
- [ ] Database credentials are secure
- [ ] API rate limiting is active
- [ ] Input validation is implemented

## 📞 Support

If you encounter issues:

1. Check the application logs
2. Verify environment variables
3. Test database connectivity
4. Review CORS configuration
5. Check the `DEPLOYMENT_FIXES.md` file for common solutions

## 🎉 Congratulations!

Your ReWear application is now live! Share your deployed URL with users and start building your clothing exchange community.

---

**Next Steps:**
1. Set up a custom domain (optional)
2. Configure SSL certificates
3. Set up monitoring and analytics
4. Plan for scaling as your user base grows
