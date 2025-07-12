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

// Remove item (admin only)
router.delete("/items/:id", protect, admin, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Completely remove the item from database
    await Item.findByIdAndDelete(req.params.id);

    res.json({ message: "Item removed successfully" });
  } catch (error) {
    console.error('Error removing item:', error);
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

    // Get users first
    const users = await User.find(query).select('-password');
    
    // Get item counts for each user
    const usersWithItemCounts = await Promise.all(
      users.map(async (user) => {
        const itemCount = await Item.countDocuments({ user: user._id });
        return {
          ...user.toObject(),
          itemsCount: itemCount
        };
      })
    );

    console.log('Users found:', usersWithItemCounts.length);
    res.json({ users: usersWithItemCounts });
  } catch (error) {
    console.error('Error in /users route:', error);
    res.status(500).json({ message: "Server error", error: error.message });
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
        $match: { status: "accepted" }
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

// Get swaps for admin moderation
router.get("/swaps", protect, admin, async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }

    const swaps = await Swap.find(query)
      .populate([
        { path: 'initiator', select: 'name email' },
        { path: 'recipient', select: 'name email' },
        { path: 'initiatorItem', select: 'title image condition status' },
        { path: 'recipientItem', select: 'title image condition status' }
      ])
      .sort({ createdAt: -1 });

    res.json({ swaps });
  } catch (error) {
    console.error('Error fetching swaps for admin:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Approve swap
router.put("/swaps/:id/approve", protect, admin, async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.id);
    
    if (!swap) {
      return res.status(404).json({ message: "Swap not found" });
    }

    if (swap.status !== "pending") {
      return res.status(400).json({ message: "Only pending swaps can be approved" });
    }

    swap.status = "accepted";
    swap.approvedBy = req.user._id;
    swap.approvedAt = new Date();
    await swap.save();

    // Update item statuses to swapped (both items are now swapped)
    await Item.findByIdAndUpdate(swap.initiatorItem, { 
      status: 'swapped',
      isActive: false 
    });
    await Item.findByIdAndUpdate(swap.recipientItem, { 
      status: 'swapped',
      isActive: false 
    });

    res.json({ message: "Swap approved successfully", swap });
  } catch (error) {
    console.error('Error approving swap:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Reject swap
router.put("/swaps/:id/reject", protect, admin, async (req, res) => {
  try {
    const { reason } = req.body;
    const swap = await Swap.findById(req.params.id);
    
    if (!swap) {
      return res.status(404).json({ message: "Swap not found" });
    }

    if (swap.status !== "pending") {
      return res.status(400).json({ message: "Only pending swaps can be rejected" });
    }

    swap.status = "rejected";
    swap.rejectedBy = req.user._id;
    swap.rejectedAt = new Date();
    swap.rejectionReason = reason || "Swap rejected by admin";
    await swap.save();

    // Make items available again
    await Item.findByIdAndUpdate(swap.initiatorItem, { 
      status: 'approved',
      isActive: true 
    });
    await Item.findByIdAndUpdate(swap.recipientItem, { 
      status: 'approved',
      isActive: true 
    });

    res.json({ message: "Swap rejected successfully", swap });
  } catch (error) {
    console.error('Error rejecting swap:', error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;