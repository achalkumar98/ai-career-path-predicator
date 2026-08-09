const Joi = require('joi');

const fetchJobs = {
  body: Joi.object({
    keyword:  Joi.string().trim().allow('').default(''),
    location: Joi.string().trim().allow('').default(''),

    // recency quick-pick: maps to LinkedIn f_TPR values
    // 'all' | '1d' | '3d' | '7d' | '14d' | '30d'
    recency: Joi.string()
      .valid('all', '1d', '3d', '7d', '14d', '30d')
      .default('all'),

    // custom date range (ISO strings, optional)
    dateFrom: Joi.string().isoDate().allow('', null).default(null),
    dateTo:   Joi.string().isoDate().allow('', null).default(null),
  }),
};

module.exports = { fetchJobs };
