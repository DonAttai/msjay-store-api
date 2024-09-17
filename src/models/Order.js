const mongoose = require("mongoose");

const ORDERSTATUS = {
  PROCESSING: "PROCESSING",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
};

const PAYMENTSTATUS = {
  PENDING: "PENDING",
  PAID: "PAID",
};

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    transactionId: { type: String, required: true },
    cartItems: [
      {
        _id: false,
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],

    totalAmount: { type: String, required: true },
    orderStatus: {
      type: String,
      enum: ORDERSTATUS,
      default: ORDERSTATUS.PROCESSING,
    },
    paymentStatus: {
      type: String,
      enum: PAYMENTSTATUS,
      default: PAYMENTSTATUS.PENDING,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);

module.exports = { Order, PAYMENTSTATUS };
