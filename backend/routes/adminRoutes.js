const express=require("express");
const User=require("../models/Users");
const Course=require("../models/Course");
const {protect,admin}=require("../middleware/authMiddleware");

const router=express.Router();

// Get revenue dashboard data - MUST BE FIRST ROUTE
router.get("/revenue", protect, admin, async (req, res) => {
  try {
    // Get total revenue and clicks
    const totalStats = await Course.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$revenue" },
          totalClicks: { $sum: "$clicks" },
          totalCourses: { $sum: 1 }
        }
      }
    ]);

    // Get recent clicks (last 10 courses with clicks)
    const recentClicks = await Course.find({ clicks: { $gt: 0 } })
      .sort({ lastClicked: -1 })
      .limit(10)
      .populate("domain")
      .populate("section");

    // Get top performing courses
    const topCourses = await Course.find({})
      .sort({ revenue: -1 })
      .limit(5)
      .populate("domain")
      .populate("section");

    res.json({
      totalRevenue: totalStats[0]?.totalRevenue || 0,
      totalClicks: totalStats[0]?.totalClicks || 0,
      totalCourses: totalStats[0]?.totalCourses || 0,
      recentClicks,
      topCourses
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all users
router.get("/",protect,admin,async(req,res)=>{
  try{
    const users=await User.find({});
    res.json(users);
  }catch(error){
    console.error(error);
    res.status(500).json({message:"server error"});
  }
});

router.post("/", protect, admin, async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "user already exists" });
    }
    user = new User({
      name,
      email,
      password,
      role: role || "customer",
    });
    await user.save();
    res.status(201).json({ message: "user created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
});

router.put("/:id", protect, admin, async (req, res) => {
  try {
    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Only update fields if they are explicitly provided
    if (req.body.name !== undefined) user.name = req.body.name;
    if (req.body.email !== undefined) user.email = req.body.email;
    if (req.body.role !== undefined) user.role = req.body.role;

    const updatedUser = await user.save();

    res.json({
      message: "User updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/admin/users/:id
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports=router;