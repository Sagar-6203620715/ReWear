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

const app = express();
app.use(express.json());
app.use(cors());

dotenv.config();

const PORT = process.env.PORT || 3000;

connectDB();

app.get("/", (req, res) => {
  res.send("Coursify");
});

app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/domains", domainRoutes); 
app.use("/api/upload",uploadRoutes);
app.use("/api/",subscriberRoutes);
app.use("/api/sections", sectionRoutes);
app.use('/api/chats', chatRoutes);



//admin routes
app.use("/api/admin/users",adminRoutes);
app.use("/api/admin/courses",courseAdminRoutes);
app.use("/api/admin/domains",domainAdminRoutes);



app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
