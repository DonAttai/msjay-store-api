const createError = require("http-errors");
const {
  createCartSchema,
  updateCartSchema,
} = require("../helpers/validation-schema");
const Cart = require("../models/Cart");
const GuestUser = require("../models/GuestUser");
const Product = require("../models/Product");

// create cart
const addToCart = async (req, res, next) => {
  try {
    // validate request body
    const { productId } = await createCartSchema.validateAsync(req.body);

    // check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return next(createError.NotFound("Product not found!"));
    }
    // get user id
    let userId = req.user?.id;

    // guest user
    if (!userId) {
      let guestUser = await GuestUser.findOne({
        _id: req.signedCookies.device,
      });
      if (!guestUser) {
        guestUser = await GuestUser.create({ role: "guest user" });
        res.cookie("device", guestUser._id, {
          maxAge: 30 * 24 * 60 * 60 * 1000,
          signed: true,
          httpOnly: true,
        });
      }

      // find guest user cart
      let cart = await Cart.findOne({ userId: guestUser._id });

      if (!cart) {
        cart = await Cart.create({
          userId: guestUser._id,
          products: [{ productId, quantity: 1 }],
        });
        return res.status(200).json({ message: "Item added to cart!" });
      }

      // get cart item
      const cartItem = cart.products.find((item) => {
        return item.productId.toString() === productId;
      });
      if (cartItem) {
        cartItem.quantity += 1;
        cart.save();
        return res
          .status(200)
          .json({ message: "item quantity has been updated!" });
      } else {
        cart.products.push({ productId, quantity: 1 });
        cart.save();
        res.status(200).json({ message: "item added to cart!" });
      }
    } else {
      let cart = await cart.findOne({ userId: req.user.id });
      if (!cart) {
        cart = await Cart.create({
          userId,
          products: [{ productId, quantity: 1 }],
        });
        return res.status(2000).json({ message: "Item addded to cart!" });
      }
      const cartItem = cart.products.find((item) => {
        return item.productId.toString() === productId;
      });
      if (cartItem) {
        cartItem.quantity += 1;
        return res
          .status(200)
          .json({ message: "item quantity has been updated!" });
      } else {
        cart.products.push({ productId, quantity: 1 });
        cart.save();
        return res.status(200).json({ message: "Item added to cart!" });
      }
    }
  } catch (error) {
    next(error);
  }
};

// get all cart
const getAllCarts = async (req, res, next) => {
  try {
    const cart = await Cart.find();
    res.status(200).json(cart);
  } catch (error) {
    next(error);
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

// decrease cart item quantity
const decreaseCartItemQuantity = async (req, res, next) => {
  const productId = req.params.productId;
  const userId = req.user.id;
  try {
    let cart = await Cart.findOne({ userId });
    const cartItem = cart.products.find(
      (item) => item.productId.toString() === productId
    );
    if (cartItem.quantity > 1) {
      cartItem.quantity -= 1;
      cart.save();
    } else {
      await Cart.updateOne(
        { _id: cart._id },
        { $pull: { products: { productId } } }
      );
      return res.status(200).json({ message: "Item removed from cart" });
    }
    res.status(200).json({ message: "Item quantity has been updated!" });
  } catch (error) {
    next(error);
  }
};

// remove item from cart
const removeItemFromCart = async (req, res, next) => {
  const userId = req.user.id;
  const productId = req.body.productId;
  try {
    const cart = await Cart.findOne({ userId });
    await Cart.updateOne(
      { _id: cart._id },
      { $pull: { products: { productId } } }
    );
    res.status(200).json({ message: "Item removed from cart!" });
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
    next(error);
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

module.exports = {
  addToCart,
  getAllCarts,
  getCart,
  updateCart,
  deleteCart,
  decreaseCartItemQuantity,
  removeItemFromCart,
};
