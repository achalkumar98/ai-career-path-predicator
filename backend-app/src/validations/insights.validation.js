const Joi = require('joi');

const createInsight = {
  body: Joi.object({
    input: Joi.string().trim().min(1).required(),
  }),
};

module.exports = { createInsight };
