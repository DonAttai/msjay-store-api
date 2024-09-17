const express = require("express");
const {
  initializePayment,
  paystackWebHook,
  handleCallback,
} = require("../controllers/payment-controller");
const { isAuthenticated } = require("../middleware/auth-middleware");

const router = express.Router();

router.post("/initialize", isAuthenticated, initializePayment);
router.get("/callback", handleCallback);
router.post("/webhook", paystackWebHook);

module.exports = router;
