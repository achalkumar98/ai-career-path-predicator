const Joi = require('joi');

const register = {
  body: Joi.object({
    name: Joi.string().trim().min(1).required(),
    email: Joi.string().trim().email().required(),
    password: Joi.string().min(6).required(),
  }),
};

const login = {
  body: Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().min(1).required(),
  }),
};

const forgotPassword = {
  body: Joi.object({
    email: Joi.string().trim().email().required(),
  }),
};

const resetPassword = {
  body: Joi.object({
    token: Joi.string().trim().min(1).required(),
    password: Joi.string().min(6).required(),
  }),
};

const updateProfile = {
  body: Joi.object({
    name: Joi.string().trim().min(1),
    email: Joi.string().trim().email(),
    bio: Joi.string(),
    phone: Joi.string().trim(),
    location: Joi.string().trim(),
  }).min(1),
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  updateProfile,
};
