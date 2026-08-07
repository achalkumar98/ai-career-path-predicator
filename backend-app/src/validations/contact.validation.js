const Joi = require('joi');

const sendContactMessage = {
  body: Joi.object({
    name: Joi.string().trim().min(1).required(),
    email: Joi.string().trim().email().required(),
    subject: Joi.string().trim().min(1).required(),
    message: Joi.string().trim().min(10).required(),
  }),
};

module.exports = { sendContactMessage };
