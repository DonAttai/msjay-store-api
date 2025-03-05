const express = require("express");
const productRoutes = express.Router();
const {
  getAllProducts,
  getProductById,
} = require("../controllers/products-controller");

// Get all products
productRoutes.get("/", getAllProducts);

// get a product by id
productRoutes.get("/:id", getProductById);

module.exports = productRoutes;
