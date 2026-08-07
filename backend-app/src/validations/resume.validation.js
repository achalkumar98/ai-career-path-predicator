const Joi = require('joi');

const uploadResume = {
  file: Joi.object({
    mimetype: Joi.string().valid('application/pdf').required(),
    size: Joi.number().max(10 * 1024 * 1024).required(),
  })
    .unknown(true)
    .required(),
};

module.exports = { uploadResume };
