# 🌍 Environment Setup for Separate Deployments

## 🚨 **CRITICAL: Environment Variables Required**

### **Backend Deployment (Vercel)**

#### **Required Variables:**
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/rewear?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters_long
NODE_ENV=production
```

#### **Optional Variables:**
```
FRONTEND_URL=https://your-frontend-domain.vercel.app
ADDITIONAL_FRONTEND_URLS=https://your-custom-domain.com
```

### **Frontend Deployment (Vercel)**

#### **Required Variables:**
```
VITE_BACKEND_URL=https://your-backend-domain.vercel.app
```

## 🔧 **Backend Environment Setup**

### **1. MongoDB Atlas:**
- Create cluster at [mongodb.com](https://mongodb.com)
- Get connection string
- Add to `MONGO_URI` environment variable

### **2. JWT Secret:**
- Generate strong secret (32+ characters)
- Add to `JWT_SECRET` environment variable

### **3. Frontend URL:**
- Set `FRONTEND_URL` to your frontend domain
- This enables CORS for your frontend

## 🌐 **Frontend Environment Setup**

### **1. Backend URL:**
- Set `VITE_BACKEND_URL` to your backend domain
- Must include `https://` protocol
- Example: `https://rewear-backend.vercel.app`

## ⚠️ **Common Issues & Solutions**

### **Issue 1: CORS Errors**
**Solution:** Ensure `FRONTEND_URL` is set correctly in backend

### **Issue 2: Frontend Can't Connect to Backend**
**Solution:** Verify `VITE_BACKEND_URL` is set and accessible

### **Issue 3: MongoDB Connection Fails**
**Solution:** Check `MONGO_URI` format and network access

### **Issue 4: JWT Authentication Fails**
**Solution:** Verify `JWT_SECRET` is set and consistent

## 🧪 **Testing Your Setup**

### **Backend Test:**
```bash
curl https://your-backend.vercel.app/health
# Should return: {"status":"ok"}
```

### **Frontend Test:**
1. Open frontend in browser
2. Check console for errors
3. Verify API calls work

## 🔒 **Security Notes**

- **Never commit** environment variables to Git
- **Use strong secrets** for JWT_SECRET
- **Restrict MongoDB access** to your deployment domains
- **Enable CORS** only for your frontend domains

---

**Remember: Environment variables are the key to connecting your separate deployments!**
