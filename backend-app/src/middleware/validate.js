/**
 * Validates request body, query, and params with Joi schemas structured as
 * { body, query, params, file }.
 */
module.exports = (schema) => (req, res, next) => {
  if (!schema) return next();

  const options = {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: false,
  };

  for (const key of ['body', 'query', 'params', 'file']) {
    if (!schema[key]) continue;

    const { error, value } = schema[key].validate(req[key], options);
    if (error) {
      return res.status(400).json({ errors: error.details });
    }

    req[key] = value;
  }

  next();
};
