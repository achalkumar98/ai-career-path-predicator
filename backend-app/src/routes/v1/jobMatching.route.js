const express = require('express');
const router = express.Router();
const jobMatchingController = require('../../controllers/jobMatching.controller');

/**
 * @swagger
 * tags:
 *   name: JobMatching
 *   description: Job matching endpoints
 */
/**
 * @swagger
 * /job-matching:
 *   post:
 *     tags:
 *       - JobMatching
 *     summary: Find job matches for a user profile
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
 *     responses:
 *       200:
 *         description: Matches returned
 */
router.post('/', jobMatchingController.findMatches);

module.exports = router;
