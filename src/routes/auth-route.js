const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/auth-middleware");
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  verifyEmail,
  logOut,
} = require("../controllers/auth-controllers");
const validateUser = require("../middleware/validate-user-middleware");

// Register
router.post("/register", register);

// Login
router.post("/login", validateUser, login);

router.post("/logout", isAuthenticated, logOut);

router.post("/verify-email", verifyEmail);
router.post("/forget-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
