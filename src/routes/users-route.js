const express = require("express");
const router = express.Router();
const { updateUser, getAllUsers } = require("../controllers/users-controller");
const {
  verifyAccessToken,
  verifyAccessTokenAndAuthorization,
  verifyAccessTokenAndAdmin,
} = require("../middleware/authMiddleware");

router.patch("/:id", verifyAccessTokenAndAuthorization, updateUser);

router.get("/", verifyAccessToken, getAllUsers);

module.exports = router;
