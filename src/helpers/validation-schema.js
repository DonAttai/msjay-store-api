const { number } = require("joi");
const Joi = require("joi");

// register schema
const registerSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }).lowercase().required(),
  password: Joi.string().min(8).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
});

// login schema
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
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
  stock: Joi.number(),
  image: Joi.string(),
});

// update product schema
const updateProductSchema = Joi.object({
  title: Joi.string(),
  price: Joi.number(),
  category: Joi.string(),
  description: Joi.string(),
  stock: Joi.number(),
});

// create cart schema
const createCartSchema = Joi.object({
  productId: Joi.string().required(),
  quantity: Joi.number(),
});

// update cart schema
const updateCartSchema = Joi.object({
  productId: Joi.string().required(),
  quantity: Joi.number().required(),
});

// create order schema
const createOrderSchema = Joi.object({
  email: Joi.string().required(),
  amount: Joi.number().required(),
  cartItems: Joi.array().items(createCartSchema),
});

// update order schema
const updateOrderSchema = Joi.object({
  orderStatus: Joi.string().required(),
});

const resetPasswordSchema = Joi.object({
  password: Joi.string().min(8).required(),
});
const forgetPasswordSchema = Joi.object({
  email: Joi.string().min(8).required(),
});

// create address schema
const addressSchema = Joi.object({
  address: Joi.string().required(),
  street: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  phone: Joi.string().required(),
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
  addressSchema,
};
