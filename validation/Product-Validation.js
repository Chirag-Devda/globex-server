const Joi = require("joi");

const productValidationSchema = Joi.object({
  title: Joi.string().min(1).max(255).required(),
  images: Joi.array()
    .items(Joi.binary())
    .required()
    .messages({ "any.required": "abe yar photo toh bhej!🤣" }),
  price: Joi.number().positive().required(),
  discountPercentage: Joi.number().optional().min(0).max(100),
  finalPrice: Joi.number().positive().required(),
  description: Joi.string().min(1).max(1000).optional(),
  category: Joi.string().min(1).max(255).required(),
  subCategory: Joi.string().min(1).max(255).required(),
  itemType: Joi.string().min(1).max(255).required(),
  stock: Joi.number().integer().min(0).required(),
  sizes: Joi.array().items(Joi.string()).default([]),
  colors: Joi.array().items(Joi.string).default([]),
  brand: Joi.string().required(),
  tags: Joi.array().items(Joi.string).default([]).optional(),
  salesTaxRate: Joi.number().optional().min(0).max(100),
  isActive: Joi.boolean().optional(),
  reviews: Joi.array().items(Joi.object()).default([]),
});

module.exports = productValidationSchema;
