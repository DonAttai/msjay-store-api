const Joi = require("joi");

// register schema
const registerSchema = Joi.object({
  username: Joi.string().min(3).required(),
  email: Joi.string().email({ minDomainSegments: 2 }).lowercase().required(),
  password: Joi.string().min(8).required(),
});

// login schema
const loginSchema = Joi.object({
  username: Joi.string().min(3).required(),
  password: Joi.string().required(),
});

// password schema
const passwordSchema = Joi.object({
  password: Joi.string().min(8).required(),
});

// roles schema
const rolesSchema = Joi.object({
  roles: Joi.array()
    .length(1)
    .items(Joi.string().valid("user", "admin").required()),
});

// product schema
const createProductSchema = Joi.object({
  title: Joi.string().required(),
  price: Joi.number().required(),
  category: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.string().required(),
});

// update product schema
const updateProductSchema = Joi.object({
  title: Joi.string(),
  price: Joi.number(),
  category: Joi.string(),
  description: Joi.string(),
  image: Joi.string(),
});

// create cart schema
const createCartSchema = Joi.object({
  productId: Joi.string()
    .meta({
      _mongoose: { type: "objectId", ref: "Product" },
    })
    .required(),
  quantity: Joi.number(),
});

// update cart schema
const updateCartSchema = Joi.object({
  productId: Joi.string()
    .meta({
      _mongoose: { type: "objectId", ref: "Product" },
    })
    .required(),
  quantity: Joi.number().required(),
});

// create order schema
const createOrderSchema = Joi.object({
  productId: Joi.string()
    .meta({
      _mongoose: { type: "objectId", ref: "Product" },
    })
    .required(),
  quantity: Joi.number().required(),

  amount: Joi.number().required(),
});

// update order schema
const updateOrderSchema = Joi.object({
  productId: Joi.string()
    .meta({
      _mongoose: { type: "objectId", ref: "Product" },
    })
    .required(),
  quantity: Joi.number().required(),

  amount: Joi.number().required(),
});

const resetPasswordSchema = Joi.object({
  password: Joi.string().min(8).required(),
});
const forgetPasswordSchema = Joi.object({
  email: Joi.string().min(8).required(),
});

module.exports = {
  registerSchema,
  loginSchema,
  passwordSchema,
  rolesSchema,
  createProductSchema,
  updateProductSchema,
  createCartSchema,
  updateCartSchema,
  createOrderSchema,
  updateOrderSchema,
  resetPasswordSchema,
  forgetPasswordSchema,
};
