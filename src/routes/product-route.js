const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  createProduct,
  getProductStats,
  deleteProduct,
  getProductById,
  updateProduct,
} = require("../controllers/products-controller");
const { verifyToken } = require("../middleware/authMiddleware");

// Get all products
router.get("/", getAllProducts);
router.post("/", verifyToken, createProduct);

// update  a product
router.patch("/:id", verifyToken, updateProduct);

// get a product by id
router.get("/:id", getProductById);

// delete a product
router.delete("/:id", verifyToken, deleteProduct);

module.exports = router;
