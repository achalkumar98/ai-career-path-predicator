const express = require('express');
const multer = require('multer');
const authMiddleware = require('../../middleware/auth');
const resumeController = require('../../controllers/resume.controller');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/resume/upload
router.post('/upload', authMiddleware, upload.single('resume'), resumeController.uploadResume);

module.exports = router;
