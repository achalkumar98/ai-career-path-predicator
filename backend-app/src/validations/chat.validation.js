const Joi = require('joi');

const postChat = {
  body: Joi.object({
    message: Joi.string().trim().min(1).required(),
  }),
};

module.exports = { postChat };
