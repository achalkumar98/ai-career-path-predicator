const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const insightsController = require('../../controllers/insights.controller');

// POST /api/insights
router.post('/', authMiddleware, insightsController.createInsight);

module.exports = router;
