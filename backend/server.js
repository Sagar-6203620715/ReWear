const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const courseRoutes = require("./routes/courseRoutes");
const domainRoutes = require("./routes/domainRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const sectionRoutes = require("./routes/sectionRoutes");
const chatRoutes = require("./routes/chatRoutes");
const adminRoutes = require("./routes/adminRoutes");
const courseAdminRoutes = require("./routes/courseAdminRoutes");
const domainAdminRoutes = require("./routes/domainAdminRoutes");
const subscriberRoutes = require("./routes/subscriberRoutes");
const app = express();

const PORT = process.env.PORT || 9000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
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
  mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));
} else {
  console.warn("MONGO_URI not set. Skipping DB connection.");
}

app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/domains", domainRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/admin/users", adminRoutes);
app.use("/api/admin/courses", courseAdminRoutes);
app.use("/api/admin/domains", domainAdminRoutes);
app.use("/api/", subscriberRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/", (req, res) => {
  res.json({ message: "Coursify API" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});