const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const User = require("../models/Users");
const { protect } = require("../middleware/authMiddleware");

// @route   POST /api/items
// @desc    Create a new item
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const {
      name,
      category,
      size,
      condition,
      description,
      brand,
      color,
      material,
      images,
      location
    } = req.body;

    // Validate required fields
    if (!name || !category || !size || !condition || !description) {
      return res.status(400).json({
        message: "Missing required fields: name, category, size, condition, description"
      });
    }

    if (!images || images.length === 0) {
      return res.status(400).json({
        message: "At least one image is required"
      });
    }

    // Get user location if not provided
    let userLocation = location;
    if (!userLocation) {
      const user = await User.findById(req.user.id).select('location');
      userLocation = user?.location || 'Unknown Location';
    }

    // Create new item
    const newItem = new Item({
      name,
      category,
      size,
      condition,
      description,
      brand: brand || '',
      color: color || '',
      material: material || '',
      images,
      user: req.user.id,
      location: userLocation,
      status: 'pending',
      isActive: true
    });

    const savedItem = await newItem.save();

    // Populate user info for response
    await savedItem.populate('user', 'name email');

    res.status(201).json({
      message: "Item created successfully",
      item: savedItem
    });

  } catch (error) {
    console.error("Error creating item:", error);
    res.status(500).json({
      message: "Server error while creating item",
      error: error.message
    });
  }
});

// @route   GET /api/items
// @desc    Get all available items with optional filters
// @access  Public
router.get("/", async (req, res) => {
  try {
    const {
      category,
      size,
      condition,
      sortBy = 'newest',
      limit = 20,
      page = 1
    } = req.query;

    // Build filter object - show both approved and available items during transition
    const filter = {
      status: { $in: ['approved', 'available'] },
      isActive: true
    };

    if (category) filter.category = category;
    if (size) filter.size = size;
    if (condition) filter.condition = condition;

    // Build sort object
    let sort = {};
    switch (sortBy) {
      case 'newest':
        sort = { createdAt: -1 };
        break;
      case 'oldest':
        sort = { createdAt: 1 };
        break;
      case 'condition':
        sort = { condition: 1 };
        break;
      default:
        sort = { createdAt: -1 };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const items = await Item.find(filter)
      .populate('user', 'name')
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip);

    // Get total count for pagination
    const total = await Item.countDocuments(filter);

    res.json({
      items,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        hasNext: skip + items.length < total,
        hasPrev: parseInt(page) > 1
      },
      total
    });

  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({
      message: "Server error while fetching items",
      error: error.message
    });
  }
});

// @route   GET /api/items/:id
// @desc    Get item by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('user', 'name email location');

    if (!item) {
      return res.status(404).json({
        message: "Item not found"
      });
    }

    if (!item.isActive || !['approved', 'available'].includes(item.status)) {
      return res.status(404).json({
        message: "Item is not available"
      });
    }

    res.json({ item });

  } catch (error) {
    console.error("Error fetching item:", error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        message: "Item not found"
      });
    }
    res.status(500).json({
      message: "Server error while fetching item",
      error: error.message
    });
  }
});

// @route   PUT /api/items/:id
// @desc    Update item
// @access  Private (owner only)
router.put("/:id", protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: "Item not found"
      });
    }

    // Check if user owns the item
    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({
        message: "Not authorized to update this item"
      });
    }

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    res.json({
      message: "Item updated successfully",
      item: updatedItem
    });

  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({
      message: "Server error while updating item",
      error: error.message
    });
  }
});

// @route   DELETE /api/items/:id
// @desc    Delete item (soft delete)
// @access  Private (owner only)
router.delete("/:id", protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: "Item not found"
      });
    }

    // Check if user owns the item
    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({
        message: "Not authorized to delete this item"
      });
    }

    // Soft delete - set isActive to false
    item.isActive = false;
    item.status = 'removed';
    await item.save();

    res.json({
      message: "Item removed successfully"
    });

  } catch (error) {
    console.error("Error removing item:", error);
    res.status(500).json({
      message: "Server error while removing item",
      error: error.message
    });
  }
});

// @route   GET /api/items/user/:userId
// @desc    Get items by user
// @access  Public
router.get("/user/:userId", async (req, res) => {
  try {
    const items = await Item.find({
      user: req.params.userId,
      isActive: true
    })
    .populate('user', 'name')
    .sort({ createdAt: -1 });

    res.json({ items });

  } catch (error) {
    console.error("Error fetching user items:", error);
    res.status(500).json({
      message: "Server error while fetching user items",
      error: error.message
    });
  }
});

// @route   GET /api/items/categories
// @desc    Get all available categories
// @access  Public
router.get("/categories", async (req, res) => {
  try {
    const categories = await Item.distinct('category', {
      status: 'available',
      isActive: true
    });

    res.json({ categories });

  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      message: "Server error while fetching categories",
      error: error.message
    });
  }
});

module.exports = router; 