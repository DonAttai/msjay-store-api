const { OrderSchema } = require("../helpers/validation-schema");
const Order = require("../models/Order");

// get all orders
const getAllOrders = async (req, res, next) => {
  try {
    const order = await Order.find();
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllOrders };
