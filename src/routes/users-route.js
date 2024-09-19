const express = require("express");
const router = express.Router();
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
router.get("/", isAuthenticated, checkRole([ROLE.ADMIN]), getAllUsers);

// get users statistics
router.get("/stats", isAuthenticated, checkRole([ROLE.ADMIN]), getUsersStats);
router.get(
  "/:userId/address",
  isAuthenticated,
  checkRole([ROLE.ADMIN]),
  getUserWithAddress
);

// get a single user
router.get("/:id", isAuthenticated, getCurrentUserOrAdmin(), getUserById);

// update user
router.patch("/:id", isAuthenticated, updateUser);

// delete user
router.delete("/:id", isAuthenticated, deleteUser);

module.exports = router;
