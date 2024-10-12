const crypto = require("crypto");
const axios = require("axios");
const { createOrderSchema } = require("../helpers/validation-schema");
const { Order, PAYMENTSTATUS } = require("../models/Order");
const Cart = require("../models/Cart");
const createError = require("http-errors");
const { randomUUID } = require("crypto");

const secret = process.env.PAYSTACK_SECRET_KEY;
const { CLIENT_URL_REMOTE, CLIENT_URL_LOCAL, API_URL } = process.env;

// initialize paystack payment
const initializePayment = async (req, res, next) => {
  const guestCart = req.session.guestCart;
  const options = {
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
  };
  try {
    const validatedData = await createOrderSchema.validateAsync(req.body);
    console.log(validatedData);

    const { customer, amount, cartItems, addressInfo } = validatedData;

    const transactionDetails = {
      email: customer?.email,
      amount: amount * 100,
      callback_url: `${API_URL}/api/paystack/callback`,
    };
    const paystackURL = "https://api.paystack.co/transaction/initialize";

    const response = await axios.post(paystackURL, transactionDetails, options);
    const { authorization_url, reference: transactionId } = response.data.data;
    const totalAmount = amount.toFixed(2);

    let customerId;
    if (req.user) {
      customerId = req.user.id;
    } else {
      customerId = randomUUID();
    }

    const newOrder = new Order({
      customerId,
      addressInfo,
      customer,
      transactionId,
      cartItems,
      totalAmount,
    });

    const savedOrder = await newOrder.save();

    if (savedOrder) {
      // delete guest cart if it exist
      if (guestCart) {
        req.session.guestCart = null;
      } else {
        // delete customer cart
        const cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) return next(createError.NotFound("Cart not found"));
        await cart.deleteOne({ _id: cart._id });
      }
    }
    res.status(200).json({ paymentUrl: authorization_url });
  } catch (error) {
    next(error);
  }
};

// handle paystack callback
const handleCallback = async (req, res, next) => {
  const { reference } = req.query;
  try {
    const transaction = await verifyTransaction(reference);
    if (transaction.data.status === "success") {
      const order = await Order.findOne({ transactionId: reference });
      if (order) {
        order.paymentStatus = PAYMENTSTATUS.PAID;
        await order.save();

        return res.redirect(
          `${CLIENT_URL_REMOTE}/order/success?reference=${reference}`
        );
      } else {
        return res.redirect(`${CLIENT_URL_REMOTE}/order/failed`);
      }
    } else {
      return res.redirect(`${CLIENT_URL_REMOTE}/order/failed`);
    }
  } catch (error) {
    next(error);
  }
};

// paysatck webhook
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
      console.log("data", data);
    }
    // Do something with event
  }
  res.sendStatus(200);
};

// function to verify transaction
async function verifyTransaction(reference) {
  const paystackURL = `https://api.paystack.co/transaction/verify/${reference}`;
  const options = {
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await axios.get(paystackURL, options);
    return res.data;
  } catch (error) {
    throw new Error("Payment verification failed");
  }
}

module.exports = { initializePayment, paystackWebHook, handleCallback };
