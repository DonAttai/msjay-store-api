const express = require("express");
const {
  initializePayment,
  paystackWebHook,
  handleCallback,
} = require("../controllers/payment-controller");
const { checkUser } = require("../middleware/auth-middleware");

const paymentRoutes = express.Router();

paymentRoutes.post("/initialize", checkUser, initializePayment);
paymentRoutes.get("/callback", handleCallback);
paymentRoutes.post("/webhook", paystackWebHook);

module.exports = paymentRoutes;
