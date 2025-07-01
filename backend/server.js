const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const courseRoutes = require("./routes/courseRoutes");
const domainRoutes = require("./routes/domainRoutes"); 
const sectionRoutes = require("./routes/sectionRoutes"); 
const uploadRoutes = require("./routes/uploadRoutes"); 
const subscriberRoutes = require("./routes/subscriberRoutes"); 
const adminRoutes = require("./routes/adminRoutes"); 
const courseAdminRoutes=require("./routes/courseAdminRoutes");
const domainAdminRoutes=require("./routes/domainAdminRoutes");
const chatRoutes = require('./routes/chatRoutes');
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const http = require('http');
const { Server } = require('socket.io');

// Load environment variables first
dotenv.config();

const app = express();

// Enhanced CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL || 'http://localhost:5173'] 
    : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const PORT = process.env.PORT || 9000;

// Connect to database
connectDB();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting
if (process.env.NODE_ENV === 'production') {
  app.use(rateLimit({ 
    windowMs: 15 * 60 * 1000, 
    max: 100,
    message: 'Too many requests from this IP, please try again later.'
  }));
} else {
  app.use(rateLimit({ 
    windowMs: 15 * 60 * 1000, 
    max: 10000,
    message: 'Too many requests from this IP, please try again later.'
  }));
}

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? [process.env.FRONTEND_URL || 'http://localhost:5173'] 
      : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Join a domain room
  socket.on('joinRoom', (domainId) => {
    socket.join(domainId);
    console.log(`User ${socket.id} joined room: ${domainId}`);
  });
  
  // Listen for new chat messages
  socket.on('chatMessage', (data) => {
    console.log('Chat message received:', data);
    // Broadcast to all in the room
    io.to(data.domainId).emit('chatMessage', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({ 
    message: "Coursify API", 
    version: "1.0.0",
    status: "running"
  });
});

// API routes
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/domains", domainRoutes); 
app.use("/api/upload", uploadRoutes);
app.use("/api/", subscriberRoutes);
app.use("/api/sections", sectionRoutes);
app.use('/api/chats', chatRoutes);

// Admin routes
app.use("/api/admin/users", adminRoutes);
app.use("/api/admin/courses", courseAdminRoutes);
app.use("/api/admin/domains", domainAdminRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: `Route ${req.originalUrl} not found`,
    status: 404
  });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  console.error('Stack:', err.stack);
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      message: 'Validation Error', 
      errors: Object.values(err.errors).map(e => e.message)
    });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({ 
      message: 'Invalid ID format' 
    });
  }
  
  if (err.code === 11000) {
    return res.status(400).json({ 
      message: 'Duplicate field value entered' 
    });
  }
  
  res.status(err.status || 500).json({ 
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
