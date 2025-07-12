const express =require("express");
const User=require("../models/Users");
const jwt=require("jsonwebtoken");
const {protect}=require("../middleware/authMiddleware");
const router=express.Router();


router.post("/register",async(req,res)=>{
  const {name,email,password}=req.body;
  try{
    let user=await User.findOne({email});
    if(user) return res.status(400).json({message:"user already exists"});

    user=new User({name,email,password});
    await user.save();

    const payload ={user:{id:user._id,role:user.role}};

    jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"40h"},(err,token)=>{
      if(err) throw err;

      res.status(201).json({
        user:{
          _id:user._id,
          name:user.name,
          email:user.email,
          role:user.role,
        },
        token,
      });
    });
    
  }catch(error){
    console.log(error);
    res.status(500).send("server error");
  }
});


router.post("/login",async (req,res)=>{
  const {email,password}=req.body;
  try{
    let user=await User.findOne({email});
    if(!user) return res.status(400).json({message:"invalid credentials"});
    const isMatch=await user.matchPassword(password);

    if(!isMatch)
      return res.status(400).json({message:"invalid credentials"});

    const payload ={user:{id:user._id,role:user.role}};

    jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"40h"},(err,token)=>{
      if(err) throw err;

      res.json({
        user:{
          _id:user._id,
          name:user.name,
          email:user.email,
          role:user.role,
        },
        token,
      });
    });
    
  }catch(error){
    console.error(error);
    res.status(500).send("server error");
  }
});


router.get("/profile",protect,async(req,res)=>{
  res.json(req.user);
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", protect, async (req, res) => {
  try {
    const { name, bio, location, phone, preferences } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (bio !== undefined) updateData["profile.bio"] = bio;
    if (location !== undefined) updateData["profile.location"] = location;
    if (phone !== undefined) updateData["profile.phone"] = phone;
    if (preferences) updateData["profile.preferences"] = preferences;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json(user);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error while updating profile" });
  }
});

// @route   GET /api/users/dashboard
// @desc    Get user dashboard data
// @access  Private
router.get("/dashboard", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const Item = require("../models/Item");
    const Swap = require("../models/Swap");

    // Get user's items
    const userItems = await Item.find({ 
      user: req.user.id,
      isActive: true,
      status: { $in: ['pending', 'approved', 'rejected', 'flagged', 'swapped'] }
    })
      .sort({ createdAt: -1 })
      .limit(5);

    // Get user's swaps
    const userSwaps = await Swap.find({
      $or: [
        { initiator: req.user.id },
        { recipient: req.user.id }
      ]
    })
    .populate([
      { path: 'initiator', select: 'name' },
      { path: 'recipient', select: 'name' },
      { path: 'initiatorItem', select: 'name images' },
      { path: 'recipientItem', select: 'name images' }
    ])
    .sort({ createdAt: -1 })
    .limit(5);

    // Get pending swaps count
    const pendingSwaps = await Swap.countDocuments({
      $or: [
        { initiator: req.user.id },
        { recipient: req.user.id }
      ],
      status: "pending"
    });

    // Calculate stats
    const itemsListed = await Item.countDocuments({ 
      user: req.user.id,
      isActive: true,
      status: { $in: ['pending', 'approved', 'rejected', 'flagged', 'swapped'] }
    });
    const itemsSwapped = await Swap.countDocuments({
      $or: [
        { initiator: req.user.id },
        { recipient: req.user.id }
      ],
      status: "accepted"
    });

    // Update user stats if they don't exist
    if (!user.stats) {
      user.stats = {};
    }
    user.stats.itemsListed = itemsListed;
    user.stats.itemsSwapped = itemsSwapped;
    if (!user.stats.memberSince) {
      user.stats.memberSince = user.createdAt;
    }

    res.json({
      user,
      userItems,
      userSwaps,
      pendingSwaps
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Server error while fetching dashboard data" });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID (public info only)
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('name profile stats createdAt')
      .lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(500).json({ message: "Server error while fetching user" });
  }
});

module.exports=router;