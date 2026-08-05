const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const chatController = require('../../controllers/chat.controller');

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: Chat endpoints
 */
/**
 * @swagger
 * /chat:
 *   post:
 *     tags:
 *       - Chat
 *     summary: Send a chat message and receive a reply
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Chat reply
 */
router.post('/', authMiddleware, chatController.postChat);

module.exports = router;
