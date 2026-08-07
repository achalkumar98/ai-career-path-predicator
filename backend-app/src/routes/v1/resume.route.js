const express = require('express');
const multer = require('multer');
const authMiddleware = require('../../middleware/auth');
const resumeController = require('../../controllers/resume.controller');
const resumeValidation = require('../../validations/resume.validation');
const validate = require('../../middleware/validate');

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
 *     tags: [Resume]
 *     summary: Upload and analyze a resume PDF
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [resume]
 *             properties:
 *               resume:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Resume analysis result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 score:
 *                   type: number
 *                 feedback:
 *                   type: string
 *                 suggestions:
 *                   type: array
 *                   items:
 *                     type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to process resume
 */
router.post(
  '/upload',
  authMiddleware,
  upload.single('resume'),
  validate(resumeValidation.uploadResume),
  resumeController.uploadResume
);

module.exports = router;
