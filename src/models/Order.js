const mongoose = require("mongoose");

const STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  SENT: "sent",
  DELIVERED: "delivered",
};

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: mongoose.Schema.Types.ObjectId,
        quantity: { type: Number, required: true },
      },
    ],
    amount: { type: Number, required: true },
    status: { type: String, enum: STATUS, default: STATUS.PENDING },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
