const express = require("express");
const cartRoutes = express.Router();

const {
  addToCart,
  getAllCarts,
  getCart,
  updateCart,
  deleteCart,
  decreaseCartItemQuantity,
  removeItemFromCart,
} = require("../controllers/carts-controller");
const {
  verifyToken,
  checkRole,
  isAuthenticated,
  checkUser,
} = require("../middleware/auth-middleware");
const { ROLE } = require("../models/User");

// add to cart -> Guest and Authenticated user
cartRoutes.post("/", checkUser, addToCart);

// get all carts route -> Admin
cartRoutes.get("/", isAuthenticated, checkRole([ROLE.ADMIN]), getAllCarts);

// get  cart  -> Guest and Authenticated user
cartRoutes.get("/cart", checkUser, getCart);

// remove item from cart -> Guest and Authenticated user
cartRoutes.post("/cart", checkUser, removeItemFromCart);

// decrease cart item quantity  -> Guest and Authenticated user
cartRoutes.post("/cart/:productId", checkUser, decreaseCartItemQuantity);

// update cart  -> Authenticated user
cartRoutes.patch("/:id", isAuthenticated, updateCart);

// delete cart -> Authenticated user
cartRoutes.delete("/:id", isAuthenticated, deleteCart);

module.exports = cartRoutes;
