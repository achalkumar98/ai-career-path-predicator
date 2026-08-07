const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const insightsController = require('../../controllers/insights.controller');
const insightsValidation = require('../../validations/insights.validation');
const validate = require('../../middleware/validate');

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
 *     tags: [Insights]
 *     summary: Generate AI career insight from user input
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [input]
 *             properties:
 *               input:
 *                 type: string
 *                 example: I am good at problem solving and love building products
 *     responses:
 *       200:
 *         description: Generated insight
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 insight:
 *                   type: string
 *       400:
 *         description: Input is required
 *       401:
 *         description: Unauthorized
 */
router.post('/', authMiddleware, validate(insightsValidation.createInsight), insightsController.createInsight);

module.exports = router;
