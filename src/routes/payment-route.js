const express = require("express");
const {
  initializePayment,
  paystackWebHook,
} = require("../controllers/payment-controller");

const router = express.Router();

router.post("/initialize", initializePayment);
router.post("/webhook", paystackWebHook);

module.exports = router;
