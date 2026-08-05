const express = require('express');
const router = express.Router();
const resourcesController = require('../../controllers/resources.controller');

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
 *     tags:
 *       - Resources
 *     summary: Get learning resources for a topic
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               topic:
 *                 type: string
 *     responses:
 *       200:
 *         description: Resources list
 */
router.post('/', resourcesController.getResources);

module.exports = router;
