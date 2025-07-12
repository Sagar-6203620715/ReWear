# ReWear Deployment Fixe Guide

This guide covers common deployment issues and their solutions for the ReWear clothing exchange platform.

## 🚀 Quick Deployment Checklist

### Prerequisites
- [ ] Node.js 18+ installed
- [ ] MongoDB database configured
- [ ] Environment variables set
- [ ] Cloudinary account configured
- [ ] Domain/SSL certificate ready

### Backend Deployment
- [ ] Build script configured
- [ ] Environment variables in production
- [ ] Database connection tested
- [ ] CORS settings updated
- [ ] Health check endpoint working

### Frontend Deployment
- [ ] Build optimized for production
- [ ] Environment variables configured
- [ ] API endpoints pointing to production backend
- [ ] Static assets optimized
- [ ] Error boundaries implemented

## 🔧 Common Deployment Issues & Fixes

### 1. Environment Variables Issues

#### Problem: Backend can't connect to database
```bash
Error: MongoDB connection error: Authentication failed
```

#### Solution:
```bash
# Check environment variables
echo $MONGO_URI
echo $JWT_SECRET

# Ensure proper MongoDB connection string format
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/rewear?retryWrites=true&w=majority
```

#### Problem: Frontend can't connect to backend
```bash
Error: Failed to fetch from API
```

#### Solution:
```javascript
// In frontend .env file
VITE_BACKEND_URL=https://your-backend-domain.com

// Ensure CORS is configured in backend
const corsOptions = {
  origin: ['https://your-frontend-domain.com'],
  credentials: true
};
```

### 2. Build Issues

#### Problem: Frontend build fails
```bash
Error: Module not found: Can't resolve './components/SomeComponent'
```

#### Solution:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for missing imports
npm run build --verbose

# Fix import paths (use relative paths)
import Component from '../components/Component';
```

#### Problem: Backend build fails
```bash
Error: Cannot find module 'express'
```

#### Solution:
```bash
# Install production dependencies
npm install --production

# Check package.json for correct dependencies
npm list --depth=0
```

### 3. Database Issues

#### Problem: Database connection timeout
```bash
Error: connect ETIMEDOUT
```

#### Solution:
```javascript
// In backend/server.js - add connection options
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  bufferCommands: false,
  bufferMaxEntries: 0
});
```

#### Problem: Database seeding fails
```bash
Error: Validation failed for path 'role'
```

#### Solution:
```javascript
// Update seeder.js to use correct enum values
const adminUser = await User.create({
  name: "Admin User",
  email: "admin@example.com",
  password: "123456",
  role: "admin", // Ensure this matches User model enum
});
```

### 4. CORS Issues

#### Problem: CORS errors in browser
```bash
Access to fetch at 'https://backend.com/api/items' from origin 'https://frontend.com' has been blocked by CORS policy
```

#### Solution:
```javascript
// In backend/server.js
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://your-frontend-domain.com',
      'http://localhost:3000',
      'http://localhost:5173'
    ];
    
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
};
```

### 5. Image Upload Issues

#### Problem: Cloudinary upload fails
```bash
Error: Invalid cloud name
```

#### Solution:
```javascript
// Check environment variables
console.log('Cloudinary config:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? 'SET' : 'NOT SET',
  api_secret: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET'
});

// Ensure proper configuration
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
```

### 6. Authentication Issues

#### Problem: JWT tokens not working
```bash
Error: jwt malformed
```

#### Solution:
```javascript
// Check JWT secret is set
if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET not set');
  process.exit(1);
}

// Ensure proper token format in frontend
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
```

### 7. Performance Issues

#### Problem: Slow page loads
```bash
Warning: Bundle size is too large
```

#### Solution:
```javascript
// In vite.config.js - optimize build
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['react-icons']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
});
```

## 🛠️ Platform-Specific Deployment

### Heroku Deployment

#### Backend (Heroku)
```bash
# Create Heroku app
heroku create rewear-backend

# Set environment variables
heroku config:set MONGO_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set CLOUDINARY_CLOUD_NAME=your_cloud_name
heroku config:set CLOUDINARY_API_KEY=your_api_key
heroku config:set CLOUDINARY_API_SECRET=your_api_secret
heroku config:set NODE_ENV=production

# Deploy
git push heroku main

# Check logs
heroku logs --tail
```

#### Frontend (Netlify/Vercel)
```bash
# Build command
npm run build

# Publish directory
dist

# Environment variables in Netlify/Vercel dashboard
VITE_BACKEND_URL=https://your-heroku-backend.herokuapp.com
```

### Vercel Deployment

#### Backend (Vercel)
```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

#### Frontend (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables
vercel env add VITE_BACKEND_URL
```

### AWS Deployment

#### Backend (EC2)
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
npm install -g pm2

# Start application
pm2 start server.js --name "rewear-backend"
pm2 startup
pm2 save
```

#### Frontend (S3 + CloudFront)
```bash
# Build and upload to S3
npm run build
aws s3 sync dist/ s3://your-bucket-name

# Configure CloudFront distribution
# Point to S3 bucket and set up custom domain
```

## 🔍 Debugging Commands

### Backend Debugging
```bash
# Check if server is running
curl http://localhost:9000/health

# Check environment variables
node -e "console.log(process.env)"

# Check database connection
node -e "require('mongoose').connect(process.env.MONGO_URI).then(() => console.log('DB connected')).catch(console.error)"

# Monitor logs
pm2 logs rewear-backend
```

### Frontend Debugging
```bash
# Check build output
npm run build --verbose

# Check bundle size
npm run build && npx vite-bundle-analyzer dist

# Test production build locally
npm run preview
```

## 📊 Health Check Endpoints

### Backend Health Check
```javascript
// GET /health
app.get("/health", (req, res) => {
  res.json({ 
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});
```

### Frontend Health Check
```javascript
// Add to index.html
<script>
  // Basic health check
  fetch('/health')
    .then(response => response.json())
    .then(data => console.log('Backend health:', data))
    .catch(error => console.error('Backend health check failed:', error));
</script>
```

## 🔒 Security Checklist

- [ ] Environment variables not in code
- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] JWT secrets are strong
- [ ] Database credentials secured
- [ ] API rate limiting enabled
- [ ] Input validation implemented
- [ ] Error messages don't expose sensitive data

## 📞 Support

If you encounter issues not covered in this guide:

1. Check the application logs
2. Verify environment variables
3. Test database connectivity
4. Review CORS configuration
5. Contact the development team

---

**Last Updated:** December 2024
**Version:** 1.0.0 