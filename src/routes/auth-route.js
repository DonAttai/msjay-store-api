const express = require("express");
const authRoutes = express.Router();
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
authRoutes.post("/register", register);

// Login
authRoutes.post("/login", validateUser, login);

authRoutes.post("/logout", isAuthenticated, logOut);

authRoutes.post("/verify-email", verifyEmail);
authRoutes.post("/forget-password", forgotPassword);
authRoutes.post("/reset-password/:token", resetPassword);

module.exports = authRoutes;
