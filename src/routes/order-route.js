const express = require("express");
const router = express.Router();
const {
  getAllOrders,
  getOrderByTransactionId,
  updateOrderByTransactionId,
} = require("../controllers/orders-controller");
const { ROLE } = require("../models/User");
const { isAuthenticated, checkRole } = require("../middleware/auth-middleware");

// get all orders route
router.get("/", isAuthenticated, checkRole([ROLE.ADMIN]), getAllOrders);
router.get("/:transactionId", getOrderByTransactionId);
router.patch("/:transactionId", isAuthenticated, updateOrderByTransactionId);

module.exports = router;
