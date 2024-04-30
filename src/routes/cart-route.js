const express = require("express");
const router = express.Router();

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
} = require("../middleware/auth-middleware");
const { ROLE } = require("../models/User");

// create cart route
router.post("/", verifyToken, addToCart);

// get all carts route
router.get("/", verifyToken, checkRole([ROLE.ADMIN]), getAllCarts);

// get user cart route
router.get("/cart", isAuthenticated, getCart);
// remove item from cart route
router.post("/cart", isAuthenticated, removeItemFromCart);

// decrease cart item quantity route
router.post("/cart/:productId", isAuthenticated, decreaseCartItemQuantity);

// update cart route
router.get("/:id", updateCart);

// delete cart route
router.get("/:id", deleteCart);

module.exports = router;
