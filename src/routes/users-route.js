const express = require("express");
const userRoutes = express.Router();
const {
  updateUser,
  getAllUsers,
  getUserById,
  getUsersStats,
  deleteUser,
  getUserWithAddress,
} = require("../controllers/users-controller");
const {
  verifyToken,
  checkRole,
  getCurrentUserOrAdmin,
  isAuthenticated,
} = require("../middleware/auth-middleware");
const { ROLE } = require("../models/User");

// get all users
userRoutes.get("/", isAuthenticated, checkRole([ROLE.ADMIN]), getAllUsers);

// get users statistics
userRoutes.get(
  "/stats",
  isAuthenticated,
  checkRole([ROLE.ADMIN]),
  getUsersStats
);

// get a single user
userRoutes.get("/:id", isAuthenticated, getCurrentUserOrAdmin(), getUserById);

// update user
userRoutes.patch("/:id", isAuthenticated, updateUser);

// delete user
userRoutes.delete("/:id", isAuthenticated, deleteUser);

module.exports = userRoutes;
