const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const insightsController = require('../../controllers/insights.controller');

/**
 * @swagger
 * tags:
 *   name: Insights
 *   description: Personality and trends insights
 */
/**
 * @swagger
 * /insights:
 *   post:
 *     tags:
 *       - Insights
 *     summary: Create an insight from input text
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               input:
 *                 type: string
 *     responses:
 *       200:
 *         description: Insight created
 */
router.post('/', authMiddleware, insightsController.createInsight);

module.exports = router;
