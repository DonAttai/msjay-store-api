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
  checkUser,
} = require("../middleware/auth-middleware");
const { ROLE } = require("../models/User");

// add to cart -> Guest and Authenticated user
router.post("/", checkUser, addToCart);

// get all carts route -> Admin
router.get("/", isAuthenticated, checkRole([ROLE.ADMIN]), getAllCarts);

// get  cart  -> Guest and Authenticated user
router.get("/cart", checkUser, getCart);

// remove item from cart -> Guest and Authenticated user
router.post("/cart", checkUser, removeItemFromCart);

// decrease cart item quantity  -> Guest and Authenticated user
router.post("/cart/:productId", checkUser, decreaseCartItemQuantity);

// update cart  -> Authenticated user
router.put("/:id", isAuthenticated, updateCart);

// delete cart -> Authenticated user
router.delete("/:id", isAuthenticated, deleteCart);

module.exports = router;
