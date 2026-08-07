const Joi = require('joi');

const fetchJobs = {
  body: Joi.object({
    keyword: Joi.string().trim().allow('').default(''),
    location: Joi.string().trim().allow('').default(''),
  }),
};

module.exports = { fetchJobs };
