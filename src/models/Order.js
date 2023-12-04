const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: User, required: true },
    products: [
      {
        productId: Schema.Types.ObjectId,
        quantity: { type: Number, required: true },
      },
    ],
    amount: { type: Number, required: true },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
