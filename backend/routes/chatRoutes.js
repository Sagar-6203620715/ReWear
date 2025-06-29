// routes/chatRoutes.js
const express = require('express');
const Chat = require('../models/Chat');
const router = express.Router();

// GET: Fetch chats for a domain
router.get('/:domainId', async (req, res) => {
  try {
    const chats = await Chat.find({ domain: req.params.domainId }).sort({ createdAt: 1 });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch chats' });
  }
});

// POST: Add chat message
router.post('/', async (req, res) => {
  const { domainId, user, message } = req.body;

  try {
    const chat = new Chat({ domain: domainId, user, message });
    await chat.save();
    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Failed to save message' });
  }
});

module.exports = router;
