const express = require('express');
const { submitFeedback } = require('../../controllers/feedback.controller');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Feedback
 *   description: User feedback endpoint
 */

/**
 * @swagger
 * /feedback:
 *   post:
 *     tags: [Feedback]
 *     summary: Submit user feedback
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [rating, category, message]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Achal Kumar
 *               email:
 *                 type: string
 *                 format: email
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 4
 *               category:
 *                 type: string
 *                 enum: [general, bug, feature, design, performance]
 *                 example: general
 *               message:
 *                 type: string
 *                 example: Great platform, love the resume analyzer!
 *     responses:
 *       200:
 *         description: Feedback submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *       500:
 *         description: Failed to submit feedback
 */
router.post('/', submitFeedback);

module.exports = router;
