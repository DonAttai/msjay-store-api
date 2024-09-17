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

const router = express.Router();

router.post("/", isAuthenticated, checkRole([ROLE.ADMIN]), addProduct);
router.get("/", isAuthenticated, checkRole([ROLE.ADMIN]), getAllProducts);
router.patch("/:id", isAuthenticated, checkRole([ROLE.ADMIN]), updateProduct);
router.delete("/:id", isAuthenticated, checkRole([ROLE.ADMIN]), deleteProduct);

module.exports = router;
