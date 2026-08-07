const express = require('express');
const router = express.Router();
const contactController = require('../../controllers/contact.controller');
const contactValidation = require('../../validations/contact.validation');
const validate = require('../../middleware/validate');

/**
 * @swagger
 * tags:
 *   name: Contact
 *   description: Contact form endpoint
 */

/**
 * @swagger
 * /contact:
 *   post:
 *     tags:
 *       - Contact
 *     summary: Send a contact message
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, subject, message]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               subject:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Message sent
 */
router.post('/', validate(contactValidation.sendContactMessage), contactController.sendContactMessage);

module.exports = router;
