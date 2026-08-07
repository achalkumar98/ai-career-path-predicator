const express = require('express');
const router = express.Router();
const resourcesController = require('../../controllers/resources.controller');
const resourcesValidation = require('../../validations/resources.validation');
const validate = require('../../middleware/validate');

/**
 * @swagger
 * tags:
 *   name: Resources
 *   description: Resource recommendation endpoints
 */
/**
 * @swagger
 * /resources:
 *   post:
 *     tags: [Resources]
 *     summary: Get AI-recommended learning resources
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
 *                 example: ["Python", "Machine Learning"]
 *               interests:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["AI", "Data Science"]
 *     responses:
 *       200:
 *         description: List of learning resources
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resources:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                       url:
 *                         type: string
 *                       type:
 *                         type: string
 *       500:
 *         description: Failed to fetch resources
 */
router.post('/', validate(resourcesValidation.getResources), resourcesController.getResources);

module.exports = router;
