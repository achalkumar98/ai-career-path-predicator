const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const { createAssessment, getHistory } = require('../../controllers/assessment.controller');

// POST /api/assessment
router.post('/', authMiddleware, createAssessment);

// GET /api/assessment/history
router.get('/history', authMiddleware, getHistory);

module.exports = router;
