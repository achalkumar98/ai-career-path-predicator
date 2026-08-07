const Joi = require('joi');

const getResources = {
  body: Joi.object({
    skills: Joi.array().items(Joi.string().trim().min(1)).default([]),
    interests: Joi.array().items(Joi.string().trim().min(1)).default([]),
  }),
};

module.exports = { getResources };
