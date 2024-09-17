const { updateOrderSchema } = require("../helpers/validation-schema");
const { Order } = require("../models/Order");
const createError = require("http-errors");

// get all orders
const getAllOrders = async (req, res, next) => {
  try {
    const order = await Order.find({});
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

const getOrderByTransactionId = async (req, res, next) => {
  const transactionId = req.params.transactionId;
  try {
    const order = await Order.findOne({ transactionId });
    if (!order) {
      return next(createError.NotFound("Order not found"));
    }
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

const updateOrderByTransactionId = async (req, res, next) => {
  const { transactionId } = req.params;
  try {
    const validatedData = await updateOrderSchema.validateAsync(req.body);
    const { orderStatus } = validatedData;
    const order = await Order.findOne({ transactionId });
    if (!order) {
      return next(createError.NotFound("order not found"));
    }

    order.orderStatus = orderStatus;
    await order.save();

    res.status(200).json({ message: "Update successful" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllOrders,
  getOrderByTransactionId,
  updateOrderByTransactionId,
};
