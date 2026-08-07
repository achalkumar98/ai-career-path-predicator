// routes/jobMatching.route.js
const express = require('express');
const router = express.Router();
const jobMatchingController = require('../../controllers/jobMatching.controller');
const jobMatchingValidation = require('../../validations/jobMatching.validation');
const validate = require('../../middleware/validate');

/**
 * @swagger
 * tags:
 *   name: JobMatching
 *   description: Job fetching endpoints
 */

/**
 * @swagger
 * /job-matching:
 *   post:
 *     tags:
 *       - JobMatching
 *     summary: Fetch jobs based on keyword and location
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               keyword:
 *                 type: string
 *                 example: "AIML"
 *                 description: Job search keyword
 *               location:
 *                 type: string
 *                 example: "Noida"
 *                 description: Job location
 *     responses:
 *       200:
 *         description: Jobs fetched successfully
 *       500:
 *         description: Failed to fetch jobs
 */
router.post('/', validate(jobMatchingValidation.fetchJobs), jobMatchingController.fetchJobs);

module.exports = router;
