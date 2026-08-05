const express = require('express');
const router = express.Router();
const jobMatchingController = require('../../controllers/jobMatching.controller');

// POST /api/job-matching
router.post('/', jobMatchingController.findMatches);

module.exports = router;
