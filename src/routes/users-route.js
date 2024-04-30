const express = require("express");
const router = express.Router();
const {
  updateUser,
  getAllUsers,
  getUserById,
  getUsersStats,
  deleteUser,
} = require("../controllers/users-controller");
const {
  verifyToken,
  checkRole,
  currentUserOrAdmin,
} = require("../middleware/auth-middleware");
const { ROLE } = require("../models/User");

// get all users
router.get("/", verifyToken, checkRole([ROLE.ADMIN]), getAllUsers);

// get users statistics
router.get("/stats", verifyToken, checkRole([ROLE.ADMIN]), getUsersStats);

// get a single user
router.get("/:id", verifyToken, currentUserOrAdmin(), getUserById);

// update user
router.patch("/:id", verifyToken, updateUser);

// delete user
router.delete("/:id", verifyToken, deleteUser);

module.exports = router;
