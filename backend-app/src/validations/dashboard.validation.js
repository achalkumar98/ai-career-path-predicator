const Joi = require('joi');

// Keeps the analytics endpoint strict as query filters are added in the future.
const getAnalytics = {
  query: Joi.object({}),
};

module.exports = { getAnalytics };
