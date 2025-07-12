# ReWear Performance Optimization Guide

This guide provides comprehensive strategies for optimizing the performance of the ReWear clothing exchange platform.

## 🚀 Performance Metrics & Goals

### Target Metrics
- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Time to Interactive (TTI)**: < 3.8s

### Key Performance Indicators
- Page load time: < 3 seconds
- API response time: < 500ms
- Image load time: < 2 seconds
- Bundle size: < 500KB (gzipped)
- Database query time: < 100ms

## 🎯 Frontend Performance Optimization

### 1. Bundle Optimization

#### Code Splitting
```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['react-icons', 'tailwindcss'],
          utils: ['axios', 'lodash']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
});
```

#### Dynamic Imports
```javascript
// Lazy load components
const ItemDetail = React.lazy(() => import('./pages/ItemDetail'));
const UserDashboard = React.lazy(() => import('./pages/UserDashboard'));

// Lazy load admin components
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
```

#### Tree Shaking
```javascript
// Import only what you need
import { FiSearch, FiHeart } from 'react-icons/fi';
// Instead of: import * as FiIcons from 'react-icons/fi';
```

### 2. Image Optimization

#### Cloudinary Optimization
```javascript
// Optimize image URLs
const getOptimizedImageUrl = (url, width = 400, quality = 80) => {
  if (!url) return '';
  
  // Add Cloudinary transformation parameters
  const optimizedUrl = url.replace('/upload/', `/upload/w_${width},q_${quality},f_auto/`);
  return optimizedUrl;
};

// Usage in components
<img 
  src={getOptimizedImageUrl(item.image, 300, 75)}
  alt={item.name}
  loading="lazy"
  className="w-full h-48 object-cover"
/>
```

#### Lazy Loading Images
```javascript
// Custom lazy loading hook
const useLazyImage = (src) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
    };
  }, [src]);

  return { imageSrc, isLoaded };
};
```

### 3. State Management Optimization

#### Redux Optimization
```javascript
// Optimize Redux selectors
import { createSelector } from '@reduxjs/toolkit';

// Memoized selectors
export const selectFilteredItems = createSelector(
  [state => state.items.items, state => state.items.filters],
  (items, filters) => {
    return items.filter(item => {
      // Apply filters
      return true; // Your filter logic
    });
  }
);

// Use shallowEqual for component updates
import { shallowEqual } from 'react-redux';

const items = useSelector(selectFilteredItems, shallowEqual);
```

#### React Query for Server State
```javascript
// Install and configure React Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
});
```

### 4. Component Optimization

#### React.memo for Expensive Components
```javascript
const ItemsGrid = React.memo(({ items, onItemClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map(item => (
        <ItemCard key={item._id} item={item} onClick={onItemClick} />
      ))}
    </div>
  );
});
```

#### Virtual Scrolling for Large Lists
```javascript
import { FixedSizeList as List } from 'react-window';

const VirtualizedItemsList = ({ items }) => {
  const Row = ({ index, style }) => (
    <div style={style}>
      <ItemCard item={items[index]} />
    </div>
  );

  return (
    <List
      height={600}
      itemCount={items.length}
      itemSize={200}
      width="100%"
    >
      {Row}
    </List>
  );
};
```

### 5. Caching Strategies

#### Service Worker for Offline Support
```javascript
// public/sw.js
const CACHE_NAME = 'rewear-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
```

#### Browser Caching
```javascript
// Add cache headers in backend
app.use('/api/items', (req, res, next) => {
  res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
  next();
});

app.use('/api/static', express.static('public', {
  maxAge: '1d',
  etag: true
}));
```

## 🗄️ Backend Performance Optimization

### 1. Database Optimization

#### Indexing Strategy
```javascript
// Item model indexes
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  category: { type: String, required: true, index: true },
  size: { type: String, index: true },
  brand: { type: String, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  status: { type: String, enum: ['available', 'pending', 'swapped'], index: true },
  createdAt: { type: Date, default: Date.now, index: true }
});

// Compound indexes for common queries
itemSchema.index({ category: 1, status: 1 });
itemSchema.index({ user: 1, status: 1 });
itemSchema.index({ name: 'text', description: 'text' });
```

#### Query Optimization
```javascript
// Optimize item queries
const getItems = async (filters = {}, page = 1, limit = 20) => {
  const query = {};
  
  // Apply filters
  if (filters.category) query.category = filters.category;
  if (filters.status) query.status = filters.status;
  if (filters.size) query.size = filters.size;
  
  // Use lean() for read-only queries
  const items = await Item.find(query)
    .select('name image category size brand status createdAt')
    .populate('user', 'name')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();
    
  return items;
};
```

#### Aggregation Pipeline Optimization
```javascript
// Optimize analytics queries
const getAnalytics = async () => {
  const pipeline = [
    {
      $match: {
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ];
  
  return await Item.aggregate(pipeline).allowDiskUse(true);
};
```

### 2. API Response Optimization

#### Response Compression
```javascript
const compression = require('compression');

// Enable gzip compression
app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));
```

#### Response Caching
```javascript
const mcache = require('memory-cache');

const cache = (duration) => {
  return (req, res, next) => {
    const key = 'cache-' + req.originalUrl || req.url;
    const cachedBody = mcache.get(key);
    
    if (cachedBody) {
      res.send(JSON.parse(cachedBody));
      return;
    } else {
      res.sendResponse = res.send;
      res.send = (body) => {
        mcache.put(key, body, duration * 1000);
        res.sendResponse(body);
      };
      next();
    }
  };
};

// Apply caching to routes
app.get('/api/items', cache(300), getItems);
```

#### Pagination Optimization
```javascript
// Efficient pagination
const getPaginatedItems = async (page = 1, limit = 20, filters = {}) => {
  const skip = (page - 1) * limit;
  
  // Get total count and items in parallel
  const [total, items] = await Promise.all([
    Item.countDocuments(filters),
    Item.find(filters)
      .select('name image category size brand status createdAt')
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
  ]);
  
  return {
    items,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      hasNext: page * limit < total,
      hasPrev: page > 1
    }
  };
};
```

### 3. File Upload Optimization

#### Image Processing
```javascript
const sharp = require('sharp');
const multer = require('multer');

// Optimize image before upload
const processImage = async (buffer) => {
  return await sharp(buffer)
    .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 80, progressive: true })
    .toBuffer();
};

// Multer configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 5
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  }
});
```

## 📊 Monitoring & Analytics

### 1. Performance Monitoring

#### Frontend Monitoring
```javascript
// Performance monitoring component
const PerformanceMonitor = () => {
  useEffect(() => {
    // Monitor Core Web Vitals
    if ('web-vital' in window) {
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(console.log);
        getFID(console.log);
        getFCP(console.log);
        getLCP(console.log);
        getTTFB(console.log);
      });
    }
    
    // Monitor custom metrics
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log(`${entry.name}: ${entry.startTime}ms`);
      }
    });
    
    observer.observe({ entryTypes: ['measure'] });
  }, []);
  
  return null;
};
```

#### Backend Monitoring
```javascript
// Request timing middleware
const requestTimer = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${duration}ms`);
    
    // Log slow requests
    if (duration > 1000) {
      console.warn(`Slow request: ${req.method} ${req.path} took ${duration}ms`);
    }
  });
  
  next();
};

app.use(requestTimer);
```

### 2. Error Tracking

#### Frontend Error Boundary
```javascript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to monitoring service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}
```

#### Backend Error Handling
```javascript
// Centralized error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Log to monitoring service
  // logError(err, req);
  
  res.status(err.status || 500).json({
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal Server Error' 
      : err.message
  });
});
```

## 🚀 Deployment Optimizations

### 1. Build Optimization

#### Production Build
```bash
# Frontend build optimization
npm run build

# Analyze bundle size
npm run build && npx vite-bundle-analyzer dist

# Optimize images
npm run optimize-images
```

#### Environment Configuration
```javascript
// vite.config.js - Production optimizations
export default defineConfig({
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['react-icons']
        }
      }
    }
  }
});
```

### 2. CDN Configuration

#### Static Asset Optimization
```javascript
// Serve static assets with CDN
app.use('/static', express.static('public', {
  maxAge: '1y',
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000');
    }
    if (path.endsWith('.css')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000');
    }
  }
}));
```

### 3. Database Connection Pooling

```javascript
// Optimize MongoDB connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  bufferCommands: false,
  bufferMaxEntries: 0
});
```

## 📈 Performance Testing

### 1. Load Testing

```javascript
// Load test script
const autocannon = require('autocannon');

const test = autocannon({
  url: 'http://localhost:9000/api/items',
  connections: 100,
  duration: 10,
  pipelining: 1
});

autocannon.track(test, { renderProgressBar: true });
```

### 2. Lighthouse Testing

```bash
# Install Lighthouse
npm install -g lighthouse

# Run performance audit
lighthouse https://your-domain.com --output html --output-path ./lighthouse-report.html
```

## 🔧 Performance Checklist

### Frontend
- [ ] Code splitting implemented
- [ ] Images optimized and lazy loaded
- [ ] Bundle size under 500KB
- [ ] Service worker configured
- [ ] Error boundaries in place
- [ ] React.memo used for expensive components
- [ ] Redux selectors memoized

### Backend
- [ ] Database indexes created
- [ ] Query optimization implemented
- [ ] Response compression enabled
- [ ] Caching strategy in place
- [ ] File upload optimization
- [ ] Error handling centralized
- [ ] Performance monitoring active

### Deployment
- [ ] Production build optimized
- [ ] CDN configured
- [ ] Caching headers set
- [ ] Database connection pooled
- [ ] Health checks implemented
- [ ] Monitoring tools configured

---

**Last Updated:** December 2024
**Version:** 1.0.0 