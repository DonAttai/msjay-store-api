const {
  addProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} = require("../../controllers/admin/products-controller");
const {
  checkRole,
  isAuthenticated,
} = require("../../middleware/auth-middleware");
const { ROLE } = require("../../models/User");

const express = require("express");

const adminRoutes = express.Router();

adminRoutes.post("/", isAuthenticated, checkRole([ROLE.ADMIN]), addProduct);
adminRoutes.get("/", isAuthenticated, checkRole([ROLE.ADMIN]), getAllProducts);
adminRoutes.patch(
  "/:id",
  isAuthenticated,
  checkRole([ROLE.ADMIN]),
  updateProduct
);
adminRoutes.delete(
  "/:id",
  isAuthenticated,
  checkRole([ROLE.ADMIN]),
  deleteProduct
);

module.exports = adminRoutes;
