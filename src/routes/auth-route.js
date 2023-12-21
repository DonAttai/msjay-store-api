const express = require("express");
const router = express.Router();
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  verifyEmail,
} = require("../controllers/auth-controllers");

// Register
router.post("/register", register);

// Login
router.post("/login", login);

router.post("/forget-password", forgotPassword);
router.post("/reset-password/:id/:token", resetPassword);
router.post("/verify-email/:id/:token", verifyEmail);

module.exports = router;
