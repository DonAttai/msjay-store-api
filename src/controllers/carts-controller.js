const createError = require("http-errors");
const {
  createCartSchema,
  updateCartSchema,
} = require("../helpers/validation-schema");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const addOrUpdateCartItem = (cart, productId) => {
  const productIndex = cart.products.findIndex(
    (product) => product.productId.toString() === productId
  );
  if (productIndex !== -1) {
    cart.products[productIndex].quantity += 1;
  } else {
    cart.products.push({ productId, quantity: 1 });
  }
};

// create cart
const addToCart = async (req, res, next) => {
  try {
    // validate request body
    const { productId } = await createCartSchema.validateAsync(req.body);

    // check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      next(createError.NotFound("Product not found!"));
    }

    if (req.user) {
      let userCart = await Cart.findOne({ userId: req.user.id });

      if (!userCart) {
        userCart = new Cart({ userId: req.user.id, products: [] });
      }

      addOrUpdateCartItem(userCart, productId);
      await userCart.save();
      return res.status(200).json({ message: "Item added to cart!" });
    } else {
      if (!req.session.guestCart) {
        req.session.guestCart = { userId: req.sessionID, products: [] };
      }

      addOrUpdateCartItem(req.session.guestCart, productId);
      res.status(200).json({ message: "Item added to cart!" });
    }
  } catch (error) {
    next(error);
  }
};

// get all cart
const getAllCarts = async (req, res, next) => {
  try {
    const cart = await Cart.find({});
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

// get user cart
const getCart = async (req, res, next) => {
  let cart;

  try {
    if (req.user) {
      cart = await Cart.findOne({ userId: req.user.id });
    } else {
      cart = req.session.guestCart;
    }
    if (!cart) {
      return next(createError.NotFound("Cart not found"));
    }
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

// decrease cart item quantity
const decreaseCartItemQuantity = async (req, res, next) => {
  const productId = req.params.productId;
  try {
    if (req.user) {
      // authenticated user
      const cart = await Cart.findOne({ userId: req.user.id });
      const itemIndex = cart.products.findIndex(
        (item) => item.productId.toString() === productId
      );
      if (itemIndex === -1) {
        return next(createError.NotFound("Item not found in cart"));
      }
      if (cart.products[itemIndex].quantity > 1) {
        cart.products[itemIndex].quantity -= 1;
        await cart.save();
        res.status(200).json({ message: "Item quantity has been updated!" });
      } else {
        cart.products.splice(itemIndex, 1);
        await cart.save();
        res.status(200).json({ message: "Item removed from cart" });
      }
    } else {
      // guest user
      if (!req.session.guestCart) {
        return next(createError.NotFound("cart not found"));
      }

      const cart = req.session.guestCart;
      const itemIndex = cart.products.findIndex(
        (item) => item.productId.toString() === productId
      );
      if (itemIndex === -1) {
        return next(createError.NotFound("Item not found in cart"));
      }

      if (cart.products[itemIndex].quantity > 1) {
        cart.products[itemIndex].quantity -= 1;
        res.status(200).json({ message: "Item quantity has been updated!" });
      } else {
        cart.products.splice(itemIndex, 1);
        res.status(200).json({ message: "Item removed from cart" });
      }
    }
  } catch (error) {
    next(error);
  }
};

// remove item from cart
const removeItemFromCart = async (req, res, next) => {
  const productId = req.body.productId;
  try {
    if (req.user) {
      // authenticated user
      const cart = await Cart.findOne({ userId: req.user.id });
      const itemIndex = cart.products.findIndex(
        (item) => item.productId.toString() === productId
      );
      if (itemIndex === -1) {
        return next(createError.NotFound("Item not found in cart"));
      }

      // Remove the item from the cart
      cart.products.splice(itemIndex, 1);

      await cart.save();
      res.status(200).json({ message: "Item removed from cart!" });
    } else {
      // guest user
      if (!req.session.guestCart) {
        return next(createError.NotFound("cart not found"));
      }
      const cart = req.session.guestCart;
      const itemIndex = cart.products.findIndex(
        (item) => item.productId.toString() === productId
      );
      if (itemIndex === -1) {
        return next(createError.NotFound("Item not found in cart"));
      }
      // Remove the item from the guest cart
      cart.products.splice(itemIndex, 1);

      // Update the session-based cart
      req.session.guestCart = cart;
      res.status(200).json({ message: "Item removed from cart!" });
    }
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
  try {
    const cart = await Cart.findOne({ userId: req.params.id });
    if (!cart) return next(createError.NotFound());
    await cart.deleteOne({ _id: cart._id });
    res.sendStatus(204);
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
