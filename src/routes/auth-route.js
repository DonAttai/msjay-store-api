const express = require("express");
const router = express.Router();
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  verifyEmail,
} = require("../controllers/auth-controllers");
const validateUser = require("../middleware/validate-user-middleware");

// Register
router.post("/register", register);

// Login
router.post("/login", validateUser, login);

router.post("/forget-password", forgotPassword);
router.post("/reset-password/:id/:token", resetPassword);
router.post("/verify-email/:id/:token", verifyEmail);

module.exports = router;
