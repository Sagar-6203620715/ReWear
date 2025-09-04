# 🚀 ReWear Live Deployment Checklist

## 📋 Pre-Deployment Setup

### ✅ Step 1: Set Up Required Services

#### **MongoDB Atlas Setup**
- [ ] Create MongoDB Atlas account
- [ ] Create a new cluster (FREE tier)
- [ ] Create database user with read/write permissions
- [ ] Get connection string
- [ ] Whitelist IP addresses (0.0.0.0/0 for any platform)

#### **Cloudinary Setup**
- [ ] Create Cloudinary account
- [ ] Get cloud name from dashboard
- [ ] Get API key and secret
- [ ] Test image upload

#### **GitHub Repository**
- [ ] Push all code to GitHub
- [ ] Ensure main branch is up to date

### ✅ Step 2: Environment Variables

#### **Backend Environment Variables**
```
MONGO_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/rewear?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random_at_least_32_characters
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
```

#### **Frontend Environment Variables**
```
VITE_BACKEND_URL=https://your-backend-domain.com
```

## 🚀 Deployment Steps

### **Step 3: Deploy Backend**

1. **Choose your backend platform** (Render, Heroku, Railway, etc.)
2. **Connect your GitHub repository**
3. **Configure deployment:**
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
4. **Add Environment Variables** (copy from Step 2)
5. **Deploy**

### **Step 4: Deploy Frontend**

1. **Choose your frontend platform** (Netlify, Vercel, etc.)
2. **Connect your GitHub repository**
3. **Configure deployment:**
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Publish Directory: `dist`
4. **Add Environment Variables:**
   - `VITE_BACKEND_URL=https://your-backend-url.com`
5. **Deploy**

### **Step 5: Update CORS Settings**

1. **Go back to backend project**
2. **Add frontend URL to environment variables:**
   - `FRONTEND_URL=https://your-frontend-url.com`
3. **Redeploy backend**

### **Step 6: Seed Database**

1. **Test backend health:**
   ```bash
   curl https://your-backend-url.com/health
   ```
2. **Seed initial data:**
   ```bash
   curl -X POST https://your-backend-url.com/api/seed
   ```

## 🔍 Testing Your Live Deployment

### **Backend Tests**
- [ ] Health endpoint: `https://your-backend-url.com/health`
- [ ] API root: `https://your-backend-url.com/`
- [ ] Database connection working
- [ ] Image upload working

### **Frontend Tests**
- [ ] Home page loads
- [ ] User registration works
- [ ] User login works
- [ ] Item browsing works
