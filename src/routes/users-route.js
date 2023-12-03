const express = require("express");
const router = express.Router();
const { verifyTokenAndAuthorize } = require("../middleware/authMiddleware");

router.patch("/:id", verifyTokenAndAuthorize, (req, res, next) => {
  try {
    console.log(req.user);
    res.send("update route");
  } catch (error) {
    next(error);
  }
});

router.get("/", (req, res, next) => {
  res.send("welcome!");
});

module.exports = router;
