const Joi = require('joi');

const submitFeedback = {
  body: Joi.object({
    name: Joi.string().trim().min(1).optional(),
    email: Joi.string().trim().email().optional(),
    rating: Joi.number().integer().min(1).max(5).required(),
    category: Joi.string().valid('general', 'bug', 'feature', 'design', 'performance').required(),
    message: Joi.string().trim().min(1).required(),
  }),
};

module.exports = { submitFeedback };
