const Joi = require("joi");

const registerSchema = Joi.object({
  username: Joi.string().min(3).required(),
  email: Joi.string().email({ minDomainSegments: 2 }).lowercase().required(),
  password: Joi.string().min(8).required(),
  isAdmin: Joi.boolean(),
});

const loginSchema = Joi.object({
  username: Joi.string().min(3).required(),
  password: Joi.string().required(),
});

const passwordSchema = Joi.object({
  password: Joi.string().min(8).required(),
});
const isAdminSchema = Joi.object({
  isAdmin: Joi.boolean().required(),
});

module.exports = { registerSchema, loginSchema, passwordSchema, isAdminSchema };
