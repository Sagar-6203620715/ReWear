# 🚀 ReWear Live Deployment Checklist

## 📋 Pre-Deployment Setup

### ✅ Step 1: Set Up Required Services

#### **MongoDB Atlas Setup**
- [ ] Create MongoDB Atlas account
- [ ] Create a new cluster (FREE tier)
- [ ] Create database user with read/write permissions
- [ ] Get connection string
- [ ] Whitelist IP addresses (0.0.0.0/0 for Vercel)

#### **Cloudinary Setup**
- [ ] Create Cloudinary account
- [ ] Get cloud name from dashboard
- [ ] Get API key and secret
- [ ] Test image upload

#### **GitHub Repository**
- [ ] Push all code to GitHub
- [ ] Ensure main branch is up to date

### ✅ Step 2: Environment Variables

#### **Backend Environment Variables (for Vercel)**
```
MONGO_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/rewear?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random_at_least_32_characters
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NODE_ENV=production
```

#### **Frontend Environment Variables (for Vercel)**
```
VITE_BACKEND_URL=https://your-backend-domain.vercel.app
```

## 🚀 Deployment Steps

### **Step 3: Deploy Backend to Vercel**

1. **Go to [Vercel](https://vercel.com)**
2. **Sign up with GitHub**
3. **Import your repository**
4. **Configure deployment:**
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Output Directory: (leave empty)
   - Install Command: `npm install`
5. **Add Environment Variables** (copy from Step 2)
6. **Deploy**

### **Step 4: Deploy Frontend to Vercel**

1. **Create new Vercel project**
2. **Import the same repository**
3. **Configure deployment:**
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
4. **Add Environment Variables:**
   - `VITE_BACKEND_URL=https://your-backend-url.vercel.app`
5. **Deploy**

### **Step 5: Update CORS Settings**

1. **Go back to backend Vercel project**
2. **Add frontend URL to environment variables:**
   - `FRONTEND_URL=https://your-frontend-url.vercel.app`
3. **Redeploy backend**

### **Step 6: Seed Database**

1. **Test backend health:**
   ```bash
   curl https://your-backend-url.vercel.app/health
   ```
2. **Seed initial data:**
   ```bash
   curl -X POST https://your-backend-url.vercel.app/api/seed
   ```

## 🔍 Testing Your Live Deployment

### **Backend Tests**
- [ ] Health endpoint: `https://your-backend-url.vercel.app/health`
- [ ] API root: `https://your-backend-url.vercel.app/`
- [ ] Database connection working
- [ ] Image upload working

### **Frontend Tests**
- [ ] Home page loads
- [ ] User registration works
- [ ] User login works
- [ ] Item browsing works
- [ ] Image upload works
- [ ] Admin panel accessible (if admin user)

### **Integration Tests**
- [ ] Frontend can communicate with backend
- [ ] CORS errors resolved
- [ ] Authentication working
- [ ] Real-time features working

## 🎉 Post-Deployment

### **Step 7: Final Configuration**

1. **Update DNS** (if using custom domain)
2. **Set up monitoring** (optional)
3. **Configure backups** (MongoDB Atlas)
4. **Test all features thoroughly**

### **Step 8: Go Live!**

- [ ] Share your live URL
- [ ] Monitor for any issues
- [ ] Set up alerts (optional)

## 📞 Troubleshooting

### **Common Issues:**
1. **CORS Errors**: Update FRONTEND_URL in backend environment
2. **Database Connection**: Check MongoDB connection string
3. **Image Upload**: Verify Cloudinary credentials
4. **Build Failures**: Check environment variables

### **Support Resources:**
- Vercel documentation
- MongoDB Atlas documentation
- Cloudinary documentation
- Project README.md

---

## 🎯 **Your Live URLs Will Be:**
- **Frontend**: `https://your-project-name.vercel.app`
- **Backend**: `https://your-project-name-backend.vercel.app`

**Estimated Time to Deploy: 15-30 minutes**
