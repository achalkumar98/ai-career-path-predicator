const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const chatController = require('../../controllers/chat.controller');

// POST /api/chat
router.post('/', authMiddleware, chatController.postChat);

module.exports = router;
