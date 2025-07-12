const mongoose = require("mongoose");

const swapSchema = new mongoose.Schema(
  {
    initiator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    initiatorItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true // Now required, no points-only swaps
    },
    recipientItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed", "cancelled"],
      default: "pending"
    },
    // points field removed
    messages: [{
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      message: {
        type: String,
        required: true
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
    }],
    completedAt: {
      type: Date
    },
    cancelledAt: {
      type: Date
    },
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    reason: {
      type: String
    },
    // Admin approval/rejection fields
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
      type: String
    }
  },
  {
    timestamps: true
  }
);

// Index for better query performance
swapSchema.index({ initiator: 1, status: 1 });
swapSchema.index({ recipient: 1, status: 1 });
swapSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model("Swap", swapSchema); 