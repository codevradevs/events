const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Get user conversations
router.get('/conversations', auth, async (req, res) => {
  try {
    const Chat = require('../models/Chat');
    const chats = await Chat.find({
      participants: req.user._id
    }).populate('participants', 'username').populate('lastMessage');
    res.json(chats);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get event chats user is part of
router.get('/event-chats', auth, async (req, res) => {
  try {
    const EventChat = require('../models/EventChat');
    const chats = await EventChat.find({
      participants: req.user._id
    }).populate('event', 'title');
    res.json(chats);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get messages for a conversation
router.get('/:chatId/messages', auth, async (req, res) => {
  try {
    const Message = require('../models/Message');
    const messages = await Message.find({
      chat: req.params.chatId
    }).populate('sender', 'username').sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Send message to conversation
router.post('/:chatId/message', auth, async (req, res) => {
  try {
    const Message = require('../models/Message');
    const message = new Message({
      chat: req.params.chatId,
      sender: req.user._id,
      content: req.body.content
    });
    await message.save();
    await message.populate('sender', 'username');
    res.json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get event chat messages
router.get('/event/:eventId/messages', auth, async (req, res) => {
  try {
    const EventMessage = require('../models/EventMessage');
    const messages = await EventMessage.find({
      event: req.params.eventId
    }).populate('sender', 'username').sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Send message to event chat
router.post('/event/:eventId/message', auth, async (req, res) => {
  try {
    const EventMessage = require('../models/EventMessage');
    const message = new EventMessage({
      event: req.params.eventId,
      sender: req.user._id,
      content: req.body.content
    });
    await message.save();
    await message.populate('sender', 'username');
    res.json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;