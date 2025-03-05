const express = require("express");
const orderRoutes = express.Router();
const {
  getAllOrders,
  getOrderByTransactionId,
  updateOrderByTransactionId,
} = require("../controllers/orders-controller");
const { ROLE } = require("../models/User");
const { isAuthenticated, checkRole } = require("../middleware/auth-middleware");

// get all orders route
orderRoutes.get("/", isAuthenticated, checkRole([ROLE.ADMIN]), getAllOrders);
orderRoutes.get("/:transactionId", getOrderByTransactionId);
orderRoutes.patch(
  "/:transactionId",
  isAuthenticated,
  updateOrderByTransactionId
);

module.exports = orderRoutes;
