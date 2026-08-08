const express = require('express');
const authMiddleware = require('../../middleware/authMiddleware');
const { getAnalytics } = require('../../controllers/dashboard.controller');
const dashboardValidation = require('../../validations/dashboard.validation');
const validate = require('../../middleware/validate');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Live, user-specific career dashboard analytics
 */
/**
 * @swagger
 * /dashboard/analytics:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get live career dashboard chart data
 *     description: Computes chart data from the authenticated user's assessment and AI insight history.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard analytics returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 activity:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       label: { type: string, example: Mon }
 *                       date: { type: string, format: date }
 *                       value: { type: integer, example: 3 }
 *                       assessments: { type: integer, example: 2 }
 *                       insights: { type: integer, example: 1 }
 *                 skills:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name: { type: string, example: JavaScript }
 *                       value: { type: integer, example: 4 }
 *                 interests:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name: { type: string, example: Artificial Intelligence }
 *                       value: { type: integer, example: 3 }
 *                 careers:
 *                   type: array
 *                   description: AI-recommended career paths aggregated from assessments
 *                   items:
 *                     type: object
 *                     properties:
 *                       name: { type: string, example: Data Scientist }
 *                       value: { type: integer, example: 2 }
 *                 assessmentCoverage:
 *                   type: array
 *                   description: Number of skills submitted in each of the latest assessments
 *                   items:
 *                     type: object
 *                     properties:
 *                       label: { type: string, example: Aug 7 }
 *                       date: { type: string, format: date }
 *                       value: { type: integer, example: 6 }
 *                 summary:
 *                   type: object
 *                   properties:
 *                     assessments: { type: integer, example: 8 }
 *                     insights: { type: integer, example: 5 }
 *                     skillsTracked: { type: integer, example: 6 }
 *                     interestsTracked: { type: integer, example: 4 }
 *                     careerPaths: { type: integer, example: 3 }
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Unable to load dashboard analytics
 */
router.get('/analytics', authMiddleware, validate(dashboardValidation.getAnalytics), getAnalytics);

module.exports = router;
