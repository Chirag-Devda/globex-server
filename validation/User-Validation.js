const joi = require("joi");

const userValidationSchema = joi.object({
  fullname: joi.string().min(3).max(50).required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).max(30).required(),
  contact: joi
    .string()
    .length(10)
    .pattern(/^[0-9]+$/)
    .optional(),
  picture: joi.string().optional(),
  cart: joi.array().items(joi.string()).default([]),
  orders: joi.array().items(joi.string()).default([]),
});

module.exports = userValidationSchema;
