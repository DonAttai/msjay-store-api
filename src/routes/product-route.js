const express = require("express");
const router = express.Router();
const { getAllProducts } = require("../controllers/products-controller");
const {
  verifyAccessToken,
  verifyAccessTokenAndAuthorization,
} = require("../middleware/authMiddleware");

router.get("/", verifyAccessToken, getAllProducts);

module.exports = router;
