const {
  createCartSchema,
  updateCartSchema,
} = require("../helpers/validation-schema");
const Cart = require("../models/Cart");

// create cart
const createCart = async (req, res, next) => {
  try {
    const cartData = await createCartSchema.validateAsync(req.body);
    const cart = await Cart.create(cartData);
    res.status(201).json(cart);
  } catch (error) {
    next(error);
  }
};

// get all cart
const getAllCarts = async (req, res, next) => {
  if (req.user.roles.includes("admin")) {
    try {
      const cart = await Cart.find();
      res.status(200).json(cart);
    } catch (error) {
      next(error);
    }
  } else {
    next(createError.Unathorized());
  }
};

// get user cart
const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

// update cart
const updateCart = async (req, res, next) => {
  try {
    const cartData = await updateCartSchema.validateAsync(req.body);
    const cart = await Cart.findById(req.params.id);

    if (!cart) return next(createError.NotFound());

    const updatedCart = await Cart.findByIdAndUpdate(req.params.id, cartData, {
      new: true,
    });
    res.status(200).json(updatedCart);
  } catch (error) {
    mext(error);
  }
};

// delete cart
const deleteCart = async (req, res, next) => {
  const cart = await Cart.findById(req.params.id);
  if (!cart) return next(createError.NotFound());
  try {
    await cart.deleteOne({ _id: cart._id });
  } catch (error) {
    next(error);
  }
};

module.exports = { createCart, getAllCarts, getCart, updateCart, deleteCart };
