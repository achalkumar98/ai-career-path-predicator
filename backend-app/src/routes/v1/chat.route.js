const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const chatController = require('../../controllers/chat.controller');
const chatValidation = require('../../validations/chat.validation');
const validate = require('../../middleware/validate');

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
 *     tags: [Chat]
 *     summary: Send a message to the AI career assistant
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [message]
 *             properties:
 *               message:
 *                 type: string
 *                 example: What skills do I need to become a data scientist?
 *     responses:
 *       200:
 *         description: AI reply
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reply:
 *                   type: string
 *       400:
 *         description: Invalid message
 *       401:
 *         description: Unauthorized
 */
router.post('/', authMiddleware, validate(chatValidation.postChat), chatController.postChat);

module.exports = router;
