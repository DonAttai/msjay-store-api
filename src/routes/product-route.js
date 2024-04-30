const express = require("express");
const multer = require("multer");
const router = express.Router();
const {
  getAllProducts,
  createProduct,
  deleteProduct,
  getProductById,
  updateProduct,
} = require("../controllers/products-controller");
const { verifyToken, checkRole } = require("../middleware/auth-middleware");
const { ROLE } = require("../models/User");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "img/"),
  filename: (req, file, cb) => cb(null, file.originalname),
});

// const upload = multer({ storage, limits: { fileSize: 1024 * 1024 * 2 } });
const upload = multer({ storage });

// Get all products
router.get("/", getAllProducts);

// create product
router.post(
  "/",
  verifyToken,
  checkRole([ROLE.ADMIN]),
  upload.single("image"),
  createProduct
);

// update  a product
router.patch("/:id", verifyToken, checkRole([ROLE.ADMIN]), updateProduct);

// get a product by id
router.get("/:id", getProductById);

// delete a product
router.delete("/:id", verifyToken, checkRole([ROLE.ADMIN]), deleteProduct);

module.exports = router;
