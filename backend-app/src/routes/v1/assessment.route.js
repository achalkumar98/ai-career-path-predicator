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
 *     tags:
 *       - Assessment
 *     summary: Submit an assessment (skills + interests)
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
 *               interests:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Assessment created
 */
router.post('/', authMiddleware, createAssessment);

/**
 * @swagger
 * /assessment/history:
 *   get:
 *     tags:
 *       - Assessment
 *     summary: Get assessment history for the current user
 *     responses:
 *       200:
 *         description: History list
 */
router.get('/history', authMiddleware, getHistory);

module.exports = router;
