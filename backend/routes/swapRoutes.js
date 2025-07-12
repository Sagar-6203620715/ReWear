const express = require("express");
const Swap = require("../models/Swap");
const User = require("../models/Users");
const Item = require("../models/Item");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

// @route   POST /api/swaps
// @desc    Create a new swap request
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const { recipientItemId, recipientUserId, initiatorItemId } = req.body;
    
    // Check if recipient item exists and is available
    const recipientItem = await Item.findById(recipientItemId);
    if (!recipientItem || !recipientItem.isActive || !['approved', 'available'].includes(recipientItem.status)) {
      return res.status(404).json({ message: "Item not found or not available" });
    }

    // Check if user is trying to swap with themselves
    if (req.user.id === recipientUserId) {
      return res.status(400).json({ message: "You cannot swap with yourself" });
    }

    // Check if initiator item exists and is available
    const initiatorItem = await Item.findOne({
      _id: initiatorItemId,
      user: req.user.id,
      isActive: true,
      status: { $in: ['approved', 'available'] }
    });
    if (!initiatorItem) {
      return res.status(400).json({ message: "You need to select a valid item to offer for swap" });
    }

    // Check if there's already a pending swap between these users for these items
    const existingSwap = await Swap.findOne({
      $or: [
        { initiator: req.user.id, recipient: recipientUserId, status: "pending" },
        { initiator: recipientUserId, recipient: req.user.id, status: "pending" }
      ],
      $or: [
        { initiatorItem: initiatorItem._id, recipientItem: recipientItemId },
        { initiatorItem: recipientItemId, recipientItem: initiatorItem._id }
      ]
    });
    if (existingSwap) {
      return res.status(400).json({ message: "A swap request already exists for these items" });
    }

    // Create the swap
    const swap = new Swap({
      initiator: req.user.id,
      recipient: recipientUserId,
      initiatorItem: initiatorItem._id,
      recipientItem: recipientItemId
    });

    await swap.save();

    // Populate the swap with user and item details
    await swap.populate([
      { path: 'initiator', select: 'name' },
      { path: 'recipient', select: 'name' },
      { path: 'initiatorItem', select: 'name images condition' },
      { path: 'recipientItem', select: 'name images condition' }
    ]);

    res.status(201).json({ swap });
  } catch (error) {
    console.error("Error creating swap:", error);
    res.status(500).json({ message: "Server error while creating swap" });
  }
});

// @route   GET /api/swaps/user
// @desc    Get all swaps for the current user
// @access  Private
router.get("/user", protect, async (req, res) => {
  try {
    const swaps = await Swap.find({
      $or: [
        { initiator: req.user.id },
        { recipient: req.user.id }
      ]
    })
    .populate([
      { path: 'initiator', select: 'name' },
      { path: 'recipient', select: 'name' },
      { path: 'initiatorItem', select: 'title image condition' },
      { path: 'recipientItem', select: 'title image condition' }
    ])
    .sort({ createdAt: -1 });

    res.json({ swaps });
  } catch (error) {
    console.error("Error fetching user swaps:", error);
    res.status(500).json({ message: "Server error while fetching swaps" });
  }
});

// @route   PUT /api/swaps/:id/accept
// @desc    Accept a swap request
// @access  Private
router.put("/:id/accept", protect, async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.id);
    
    if (!swap) {
      return res.status(404).json({ message: "Swap not found" });
    }

    if (swap.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to accept this swap" });
    }

    if (swap.status !== "pending") {
      return res.status(400).json({ message: "Swap is not in pending status" });
    }

    swap.status = "accepted";
    await swap.save();

    // Mark items as temporarily unavailable during swap
    if (swap.initiatorItem) {
      await Item.findByIdAndUpdate(swap.initiatorItem, { 
        status: 'pending_swap',
        isActive: false 
      });
    }
    await Item.findByIdAndUpdate(swap.recipientItem, { 
      status: 'pending_swap',
      isActive: false 
    });

    // Update user stats
    await User.findByIdAndUpdate(swap.initiator, {
      $inc: { "stats.totalSwaps": 1 }
    });
    await User.findByIdAndUpdate(swap.recipient, {
      $inc: { "stats.totalSwaps": 1 }
    });

    res.json({ swap });
  } catch (error) {
    console.error("Error accepting swap:", error);
    res.status(500).json({ message: "Server error while accepting swap" });
  }
});

// @route   PUT /api/swaps/:id/reject
// @desc    Reject a swap request
// @access  Private
router.put("/:id/reject", protect, async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.id);
    
    if (!swap) {
      return res.status(404).json({ message: "Swap not found" });
    }

    if (swap.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to reject this swap" });
    }

    if (swap.status !== "pending") {
      return res.status(400).json({ message: "Swap is not in pending status" });
    }

    swap.status = "rejected";
    await swap.save();

    // Make items available again if they were pending swap
    if (swap.initiatorItem) {
      await Item.findByIdAndUpdate(swap.initiatorItem, { 
        status: 'approved',
        isActive: true 
      });
    }
    await Item.findByIdAndUpdate(swap.recipientItem, { 
      status: 'approved',
      isActive: true 
    });

    res.json({ swap });
  } catch (error) {
    console.error("Error rejecting swap:", error);
    res.status(500).json({ message: "Server error while rejecting swap" });
  }
});

// @route   PUT /api/swaps/:id/complete
// @desc    Complete a swap
// @access  Private
router.put("/:id/complete", protect, async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.id);
    
    if (!swap) {
      return res.status(404).json({ message: "Swap not found" });
    }

    if (swap.status !== "accepted") {
      return res.status(400).json({ message: "Swap must be accepted before completion" });
    }

    // Check if user is part of the swap
    if (swap.initiator.toString() !== req.user.id && swap.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to complete this swap" });
    }

    swap.status = "completed";
    swap.completedAt = new Date();
    await swap.save();

    // Update item statuses
    if (swap.initiatorItem) {
      await Item.findByIdAndUpdate(swap.initiatorItem, { 
        status: 'swapped',
        isActive: false 
      });
    }
    await Item.findByIdAndUpdate(swap.recipientItem, { 
      status: 'swapped',
      isActive: false 
    });

    // Update user stats
    await User.findByIdAndUpdate(swap.initiator, {
      $inc: { 
        "stats.itemsSwapped": 1
      }
    });
    await User.findByIdAndUpdate(swap.recipient, {
      $inc: { 
        "stats.itemsSwapped": 1
      }
    });

    res.json({ swap });
  } catch (error) {
    console.error("Error completing swap:", error);
    res.status(500).json({ message: "Server error while completing swap" });
  }
});

// @route   PUT /api/swaps/:id/cancel
// @desc    Cancel a swap
// @access  Private
router.put("/:id/cancel", protect, async (req, res) => {
  try {
    const { reason } = req.body;
    const swap = await Swap.findById(req.params.id);
    
    if (!swap) {
      return res.status(404).json({ message: "Swap not found" });
    }

    // Check if user is part of the swap
    if (swap.initiator.toString() !== req.user.id && swap.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to cancel this swap" });
    }

    if (swap.status === "completed") {
      return res.status(400).json({ message: "Cannot cancel a completed swap" });
    }

    swap.status = "cancelled";
    swap.cancelledAt = new Date();
    swap.cancelledBy = req.user.id;
    swap.reason = reason || "";
    await swap.save();

    // Make items available again if they were pending swap
    if (swap.initiatorItem) {
      await Item.findByIdAndUpdate(swap.initiatorItem, { 
        status: 'approved',
        isActive: true 
      });
    }
    await Item.findByIdAndUpdate(swap.recipientItem, { 
      status: 'approved',
      isActive: true 
    });

    res.json({ swap });
  } catch (error) {
    console.error("Error cancelling swap:", error);
    res.status(500).json({ message: "Server error while cancelling swap" });
  }
});

// @route   POST /api/swaps/:id/message
// @desc    Add a message to a swap
// @access  Private
router.post("/:id/message", protect, async (req, res) => {
  try {
    const { message } = req.body;
    const swap = await Swap.findById(req.params.id);
    
    if (!swap) {
      return res.status(404).json({ message: "Swap not found" });
    }

    // Check if user is part of the swap
    if (swap.initiator.toString() !== req.user.id && swap.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to message this swap" });
    }

    swap.messages.push({
      sender: req.user.id,
      message
    });

    await swap.save();
    await swap.populate([
      { path: 'initiator', select: 'name' },
      { path: 'recipient', select: 'name' },
      { path: 'initiatorItem', select: 'title image' },
      { path: 'recipientItem', select: 'title image' },
      { path: 'messages.sender', select: 'name' }
    ]);

    res.json({ swap });
  } catch (error) {
    console.error("Error adding message to swap:", error);
    res.status(500).json({ message: "Server error while adding message" });
  }
});

module.exports = router; 