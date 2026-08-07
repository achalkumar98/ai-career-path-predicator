const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const { createAssessment, getHistory } = require('../../controllers/assessment.controller');

/**
 * @swagger
 * tags:
 *   name: Assessment
 *   description: Assessment endpoints
 */
/**
 * @swagger
 * /assessment:
 *   post:
 *     tags: [Assessment]
 *     summary: Submit a skill assessment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["JavaScript", "Python"]
 *               interests:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["AI", "Web Development"]
 *     responses:
 *       200:
 *         description: Assessment result with AI career recommendations
 *       400:
 *         description: Invalid skills or interests format
 *       401:
 *         description: Unauthorized
 */
router.post('/', authMiddleware, createAssessment);

/**
 * @swagger
 * /assessment/history:
 *   get:
 *     tags: [Assessment]
 *     summary: Get assessment history for the logged-in user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of past assessments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   skills:
 *                     type: array
 *                     items:
 *                       type: string
 *                   interests:
 *                     type: array
 *                     items:
 *                       type: string
 *                   result:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized
 */
router.get('/history', authMiddleware, getHistory);

module.exports = router;
