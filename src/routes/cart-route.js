const express = require("express");
const router = express.Router();

const {
  createCart,
  getAllCarts,
  getCart,
  updateCart,
  deleteCart,
} = require("../controllers/carts-controller");
const { verifyToken } = require("../middleware/authMiddleware");

// create cart route
router.post("/", createCart);

// get all carts route
router.get("/", verifyToken, getAllCarts);

// get user cart route
router.get("/:userId", getCart);

// update cart route
router.get("/:id", updateCart);

// delete cart route
router.get("/:id", deleteCart);

module.exports = router;
