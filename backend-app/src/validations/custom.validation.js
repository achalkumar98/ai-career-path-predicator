const Joi = require('joi');
const mongoose = require('mongoose');

const objectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
};

const password = (value, helpers) => {
  if (value.length < 6) return helpers.error('any.invalid');
  if (!/[0-9]/.test(value) || !/[a-zA-Z]/.test(value)) return helpers.error('any.invalid');
  return value;
};

module.exports = {
  objectId,
  password,
};
