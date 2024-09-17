const express = require("express");
const { isAuthenticated } = require("../middleware/auth-middleware");
const {
  addAddress,
  getUserAddress,
  updateUserAddress,
} = require("../controllers/address-controller");
const router = express.Router();

router.post("/", isAuthenticated, addAddress);
router.get("/:userId", isAuthenticated, getUserAddress);
router.patch("/:id", isAuthenticated, updateUserAddress);

module.exports = router;
