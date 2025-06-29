// models/Chat.js
const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  domain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Domain',
    required: true,
  },
  user: {
    type: String, // You can change to mongoose.Schema.Types.ObjectId if you use auth
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Chat', chatSchema);
