const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProductById,
} = require("../controllers/products-controller");

// Get all products
router.get("/", getAllProducts);

// get a product by id
router.get("/:id", getProductById);

module.exports = router;
