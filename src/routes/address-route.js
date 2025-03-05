const express = require("express");
const { isAuthenticated } = require("../middleware/auth-middleware");
const {
  addAddress,
  getUserAddress,
  updateUserAddress,
} = require("../controllers/address-controller");
const addressRoutes = express.Router();

addressRoutes.post("/", isAuthenticated, addAddress);
addressRoutes.get("/:userId", isAuthenticated, getUserAddress);
addressRoutes.patch("/:id", isAuthenticated, updateUserAddress);

module.exports = addressRoutes;
