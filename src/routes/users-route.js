const express = require("express");
const router = express.Router();
const {
  updateUser,
  getAllUsers,
  getUserById,
  getUsersStats,
  deleteUser,
} = require("../controllers/users-controller");
const { verifyToken } = require("../middleware/authMiddleware");

// get all users
router.get("/", verifyToken, getAllUsers);

// get users statistics
router.get("/stats", verifyToken, getUsersStats);

// get a single user
router.get("/:id", verifyToken, getUserById);

// update user
router.patch("/:id", verifyToken, updateUser);

// delete user
router.delete("/:id", verifyToken, deleteUser);

module.exports = router;
