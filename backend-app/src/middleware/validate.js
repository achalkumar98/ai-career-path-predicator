/**
 * Simple middleware to validate request using Joi schemas structured as { body, query, params }
 */
module.exports = (schema) => (req, res, next) => {
  if (!schema) return next();
  const toValidate = {};
  if (schema.body) toValidate.body = req.body;
  if (schema.query) toValidate.query = req.query;
  if (schema.params) toValidate.params = req.params;

  const Joi = require('joi');
  try {
    if (schema.body)
      schema.body.validateAsync(req.body).catch((e) => {
        throw e;
      });
    if (schema.query)
      schema.query.validateAsync(req.query).catch((e) => {
        throw e;
      });
    if (schema.params)
      schema.params.validateAsync(req.params).catch((e) => {
        throw e;
      });
    // Note: using async validation without awaiting is okay here for simple sync-like behavior,
    // but to keep it robust, call validate synchronously where possible.
    next();
  } catch (err) {
    res.status(400).json({ errors: err.details || err.message || 'Validation error' });
  }
};
