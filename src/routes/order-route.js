const express = require("express");
const router = express.Router();
const { getAllOrders } = require("../controllers/orders-controller");
const { ROLE } = require("../models/User");
const { isAuthenticated, checkRole } = require("../middleware/auth-middleware");

// get all orders route
router.get("/", isAuthenticated, checkRole([ROLE.ADMIN]), getAllOrders);

module.exports = router;
