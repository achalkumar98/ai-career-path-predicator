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
 *     tags: [JobMatching]
 *     summary: Find job matches based on skills and interests
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
 *                 example: ["React", "Node.js"]
 *               interests:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Frontend", "Startups"]
 *     responses:
 *       200:
 *         description: List of matched jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jobs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                       company:
 *                         type: string
 *                       match:
 *                         type: string
 *       500:
 *         description: Failed to fetch job matches
 */
router.post('/', jobMatchingController.findMatches);

module.exports = router;
