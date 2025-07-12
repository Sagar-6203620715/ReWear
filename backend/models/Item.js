const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
      maxlength: [100, "Item name cannot exceed 100 characters"]
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Tops", "Bottoms", "Dresses", "Outerwear", "Sweaters", "Accessories", "Shoes", "Bags", "Activewear"],
      trim: true
    },
    size: {
      type: String,
      required: [true, "Size is required"],
      enum: ["XS", "S", "M", "L", "XL", "XXL", "One Size", "Custom"],
      trim: true
    },
    condition: {
      type: String,
      required: [true, "Condition is required"],
      enum: ["Like New", "Excellent", "Good", "Fair"],
      trim: true
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"]
    },
    brand: {
      type: String,
      trim: true,
      maxlength: [50, "Brand name cannot exceed 50 characters"]
    },
    color: {
      type: String,
      trim: true,
      maxlength: [30, "Color cannot exceed 30 characters"]
    },
    material: {
      type: String,
      trim: true,
      maxlength: [50, "Material cannot exceed 50 characters"]
    },
    images: [{
      type: String,
      required: [true, "At least one image is required"]
    }],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"]
    },
    location: {
      type: String,
      trim: true,
      maxlength: [100, "Location cannot exceed 100 characters"]
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "flagged", "available", "pending_swap", "swapped", "removed"],
      default: "pending"
    },
    isActive: {
      type: Boolean,
      default: true
    },
    // Moderation fields
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    approvedAt: {
      type: Date
    },
    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    rejectedAt: {
      type: Date
    },
    rejectionReason: {
      type: String,
      trim: true
    },
    flaggedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    flaggedAt: {
      type: Date
    },
    flagReason: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Index for better query performance
itemSchema.index({ category: 1, status: 1, isActive: 1 });
itemSchema.index({ user: 1, status: 1 });
itemSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Item", itemSchema); 