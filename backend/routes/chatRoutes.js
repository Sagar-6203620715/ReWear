// routes/chatRoutes.js
const express = require('express');
const Chat = require('../models/Chat');
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");

// GET: Fetch chats for a domain
router.get('/:domainId', async (req, res) => {
  try {
    const chats = await Chat.find({ domain: req.params.domainId }).sort({ createdAt: 1 }).populate('user', 'name');
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch chats' });
  }
});

// POST: Add chat message (auth required)
router.post('/', protect, async (req, res) => {
  const { domainId, message } = req.body;
  try {
    const chat = new Chat({ domain: domainId, user: req.user._id, message });
    await chat.save();
    const populatedChat = await chat.populate('user', 'name');
    res.status(201).json(populatedChat);
  } catch (error) {
    res.status(500).json({ message: 'Failed to save message' });
  }
});

// DELETE: Delete chat message (by sender or admin)
router.delete('/:chatId', protect, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);
    if (!chat) return res.status(404).json({ message: 'Chat message not found' });
    if (chat.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await chat.deleteOne();
    res.json({ message: 'Chat message deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete message' });
  }
});

module.exports = router;
