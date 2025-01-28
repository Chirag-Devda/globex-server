const Joi = require("joi");

const productValidationSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  image: Joi.binary().optional(),
  imageUrl: Joi.string().optional().allow(""),
  price: Joi.number().positive().required(),
  discount: Joi.number().optional().min(0).max(100),
  description: Joi.string().min(1).max(1000).optional(),
  category: Joi.string().min(1).max(255).required(),
  stockQuantity: Joi.number().integer().min(0).required(),
  tags: Joi.string().optional().allow(""),
  salesTaxRate: Joi.number().optional().min(0).max(100),
  isActive: Joi.boolean().optional(),
});

module.exports = productValidationSchema;
