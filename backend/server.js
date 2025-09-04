const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const http = require('http');
const { Server } = require('socket.io');
const userRoutes = require("./routes/userRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const adminRoutes = require("./routes/adminRoutes");
const subscriberRoutes = require("./routes/subscriberRoutes");
const itemRoutes = require("./routes/itemRoutes");
const swapRoutes = require("./routes/swapRoutes");
const app = express();

const PORT = process.env.PORT || 9000;
const MONGO_URI = process.env.MONGO_URI;

// Track last DB error for diagnostics
let lastDbError = null;
const dns = require('dns');
const url = require('url');

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173', 
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
      'https://course-comparator.netlify.app',
      'https://your-frontend-domain.netlify.app',
      'https://re-wear-yxzu.vercel.app'
    ];
    
    // Add FRONTEND_URL from environment if it exists
    if (process.env.FRONTEND_URL) {
      allowedOrigins.push(process.env.FRONTEND_URL);
    }
    
    // Add any additional frontend URLs from environment
    if (process.env.ADDITIONAL_FRONTEND_URLS) {
      const additionalUrls = process.env.ADDITIONAL_FRONTEND_URLS.split(',').map(url => url.trim());
      allowedOrigins.push(...additionalUrls);
    }
    
    // For separate deployments, allow requests from configured frontend URLs
    if (process.env.NODE_ENV === 'production' && process.env.FRONTEND_URL) {
      // Check if origin matches the configured frontend URL
      if (origin === process.env.FRONTEND_URL) {
        console.log('CORS: Allowing configured frontend URL in production');
        return callback(null, true);
      }
    }
    
    console.log('CORS check - Origin:', origin);
    console.log('CORS check - Allowed origins:', allowedOrigins);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      console.log('CORS: Origin allowed');
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      // In production, be more strict; in development, be more lenient
      if (process.env.NODE_ENV === 'production') {
        callback(new Error('Not allowed by CORS'));
      } else {
        console.log('CORS: Allowing origin in development mode');
        callback(null, true);
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token', 'Origin', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Length', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: "Too many requests from this IP, please try again later."
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB connection
if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => {
      lastDbError = err;
      console.error("MongoDB connection error:", err);
    });

  // Connection event listeners to keep diagnostics up to date
  mongoose.connection.on('error', (err) => {
    lastDbError = err;
    console.error('MongoDB connection error event:', err);
  });
  mongoose.connection.on('connected', () => {
    lastDbError = null;
    console.log('MongoDB connected event');
  });
  mongoose.connection.on('reconnected', () => {
    lastDbError = null;
    console.log('MongoDB reconnected event');
  });
  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected event');
  });
} else {
  console.warn("MONGO_URI not set. Skipping DB connection.");
}

app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/subscribers", subscriberRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/swaps", swapRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Diagnostics: DB status endpoint (safe to expose; returns no secrets)
app.get("/api/db-status", (req, res) => {
  const stateCode = mongoose.connection.readyState;
  const stateNameMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  res.json({
    readyState: stateCode,
    state: stateNameMap[stateCode] || String(stateCode),
    host: mongoose.connection?.host || null,
    name: mongoose.connection?.name || null,
    error: lastDbError ? {
      message: lastDbError.message,
      code: lastDbError.code || null,
      name: lastDbError.name || null
    } : null
  });
});

// Diagnostics: DNS/SRV resolution for Atlas host
app.get("/api/dns-check", (req, res) => {
  try {
    if (!MONGO_URI) {
      return res.status(400).json({ message: 'MONGO_URI not set' });
    }
    const parsed = new url.URL(MONGO_URI.replace('mongodb+srv://', 'http://'));
    const host = parsed.host;
    // Resolve SRV records for the cluster
    dns.resolveSrv(`_mongodb._tcp.${host}`, (err, addresses) => {
      const srv = err ? { error: err.message } : { records: addresses };
      // Resolve A/AAAA for first target if available
      const target = addresses && addresses[0] ? addresses[0].name : host;
      dns.resolve(target, (err2, addrs) => {
        const a = err2 ? { error: err2.message } : { records: addrs };
        return res.json({ host, srv, a });
      });
    });
  } catch (e) {
    return res.status(500).json({ message: 'dns-check failed', error: e.message });
  }
});

app.get("/", (req, res) => {
  res.json({ message: "ReWear API" });
});

const server = http.createServer(app);
// Socket.IO CORS configuration
const socketCorsOrigins = [
  'http://localhost:3000',
  'http://localhost:5173', 
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
  'https://course-comparator.netlify.app',
  'https://your-frontend-domain.netlify.app',
  'https://re-wear-yxzu.vercel.app'
];

// Add environment variables to Socket.IO CORS
if (process.env.FRONTEND_URL) {
  socketCorsOrigins.push(process.env.FRONTEND_URL);
}

if (process.env.ADDITIONAL_FRONTEND_URLS) {
  const additionalUrls = process.env.ADDITIONAL_FRONTEND_URLS.split(',').map(url => url.trim());
  socketCorsOrigins.push(...additionalUrls);
}

const io = new Server(server, {
  cors: {
    origin: socketCorsOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room: ${roomId}`);
  });

  socket.on('chatMessage', (data) => {
    io.to(data.roomId).emit('chatMessage', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// 404 handler
app.all('*', (req, res) => {
  res.status(404).json({
    message: `Route ${req.originalUrl} not found`,
    status: 404
  });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error"
  });
});

// For Vercel serverless deployment
if (process.env.NODE_ENV !== 'production') {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Vercel
module.exports = app;