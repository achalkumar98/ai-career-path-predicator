const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const contactController = require('../../controllers/contact.controller');

const contactValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('message').isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
];

// POST /api/contact
router.post('/', contactValidation, contactController.sendContactMessage);

module.exports = router;
