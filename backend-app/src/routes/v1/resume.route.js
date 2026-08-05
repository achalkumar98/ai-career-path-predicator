const express = require('express');
const multer = require('multer');
const authMiddleware = require('../../middleware/auth');
const resumeController = require('../../controllers/resume.controller');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @swagger
 * tags:
 *   name: Resume
 *   description: Resume upload and analysis
 */
/**
 * @swagger
 * /resume/upload:
 *   post:
 *     tags:
 *       - Resume
 *     summary: Upload a resume file
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               resume:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Resume processed
 */
router.post('/upload', authMiddleware, upload.single('resume'), resumeController.uploadResume);

module.exports = router;
