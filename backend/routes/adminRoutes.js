const express = require("express");
const User = require("../models/Users");
const Item = require("../models/Item");
const Swap = require("../models/Swap");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// Get admin dashboard stats
router.get("/dashboard", protect, admin, async (req, res) => {
  try {
    // Get item statistics
    const itemStats = await Item.aggregate([
      {
        $group: {
          _id: null,
          totalItems: { $sum: 1 },
          pendingItems: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
          approvedItems: { $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] } },
          rejectedItems: { $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] } }
        }
      }
    ]);

    // Get user statistics
    const userStats = await User.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          activeUsers: { $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] } }
        }
      }
    ]);

    // Get recent items
    const recentItems = await Item.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name email");

    // Get flagged items
    const flaggedItems = await Item.find({ status: "flagged" })
      .populate("user", "name email")
      .limit(5);

    const stats = itemStats[0] || { totalItems: 0, pendingItems: 0, approvedItems: 0, rejectedItems: 0 };
    const userCounts = userStats[0] || { totalUsers: 0, activeUsers: 0 };

    res.json({
      totalItems: stats.totalItems,
      pendingItems: stats.pendingItems,
      approvedItems: stats.approvedItems,
      rejectedItems: stats.rejectedItems,
      totalUsers: userCounts.totalUsers,
      activeUsers: userCounts.activeUsers,
      recentItems,
      flaggedItems
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get items for moderation
router.get("/items", protect, admin, async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }

    const items = await Item.find(query)
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({ items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Approve item
router.put("/items/:id/approve", protect, admin, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    item.status = "approved";
    item.approvedBy = req.user._id;
    item.approvedAt = new Date();
    await item.save();

    res.json({ message: "Item approved successfully", item });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Reject item
router.put("/items/:id/reject", protect, admin, async (req, res) => {
  try {
    const { reason } = req.body;
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    item.status = "rejected";
    item.rejectedBy = req.user._id;
    item.rejectedAt = new Date();
    item.rejectionReason = reason || "Item does not meet community guidelines";
    await item.save();

    res.json({ message: "Item rejected successfully", item });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Flag item
router.put("/items/:id/flag", protect, admin, async (req, res) => {
  try {
    const { reason } = req.body;
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    item.status = "flagged";
    item.flagReason = reason || "Inappropriate content";
    item.flaggedBy = req.user._id;
    item.flaggedAt = new Date();
    await item.save();

    res.json({ message: "Item flagged successfully", item });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get users for management
router.get("/users", protect, admin, async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }

    const users = await User.find(query)
      .select('-password')
      .populate({
        path: 'items',
        select: 'title status',
        match: { status: { $in: ['approved', 'pending'] } }
      });

    // Add item count to each user
    const usersWithItemCount = users.map(user => {
      const userObj = user.toObject();
      userObj.itemsCount = user.items.length;
      return userObj;
    });

    res.json({ users: usersWithItemCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Suspend user
router.put("/users/:id/suspend", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.status = "suspended";
    user.suspendedBy = req.user._id;
    user.suspendedAt = new Date();
    await user.save();

    res.json({ message: "User suspended successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Activate user
router.put("/users/:id/activate", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.status = "active";
    user.activatedBy = req.user._id;
    user.activatedAt = new Date();
    await user.save();

    res.json({ message: "User activated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get analytics data
router.get("/analytics", protect, admin, async (req, res) => {
  try {
    // Get basic stats
    const totalItems = await Item.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalSwaps = await Swap.countDocuments();

    // Get items by category
    const itemsByCategory = await Item.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          name: "$_id",
          count: 1,
          _id: 0
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get items by status
    const itemsByStatus = await Item.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          name: "$_id",
          count: 1,
          _id: 0
        }
      }
    ]);

    // Get recent activity (simplified)
    const recentItems = await Item.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name");

    const recentActivity = recentItems.map(item => ({
      description: `New item "${item.title}" listed by ${item.user?.name || 'Unknown'}`,
      timestamp: item.createdAt,
      type: 'item'
    }));

    // Calculate total revenue (from swaps)
    const totalRevenue = await Swap.aggregate([
      {
        $match: { status: "completed" }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$points" }
        }
      }
    ]);

    res.json({
      totalItems,
      totalUsers,
      totalSwaps,
      totalRevenue: totalRevenue[0]?.total || 0,
      itemsByCategory,
      itemsByStatus,
      recentActivity,
      monthlyStats: [] // Placeholder for future implementation
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;