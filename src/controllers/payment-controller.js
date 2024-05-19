const crypto = require("crypto");
const axios = require("axios");

const secret = process.env.PAYSTACK_SECRET_KEY;
const initializePayment = async (req, res, next) => {
  const { email, amount } = req.body;

  const transactionDetails = { email, amount: amount * 100 };
  const paystackURL = "https://api.paystack.co/transaction/initialize";
  const options = {
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios.post(paystackURL, transactionDetails, options);
    res.status(200).json(response.data);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const paystackWebHook = (req, res, next) => {
  const hash = crypto
    .createHmac("sha512", secret)
    .update(JSON.stringify(req.body))
    .digest("hex");
  if (hash == req.headers["x-paystack-signature"]) {
    // Retrieve the request's body
    const { event, data } = req.body;
    if (event === "charge.success") {
      console.log("event", event);
      console.log("amount", data.amount);
    }
    // Do something with event
  }
  res.sendStatus(200);
};

module.exports = { initializePayment, paystackWebHook };
