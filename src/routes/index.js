const express = require("express");
const userRoutes = require("./users-route");
const productRoutes = require("./product-route");
const paymentRoutes = require("./payment-route");
const orderRoutes = require("./order-route");
const cartRoutes = require("./cart-route");
const authRoutes = require("./auth-route");
const addressRoutes = require("./address-route");
const adminRoutes = require("./admin/product-route");
const rootRouter = express.Router();

rootRouter.use("/auth", authRoutes);
rootRouter.use("/users", userRoutes);
rootRouter.use("/products", productRoutes);
rootRouter.use("/paystack", paymentRoutes);
rootRouter.use("/orders", orderRoutes);
rootRouter.use("/carts", cartRoutes);
rootRouter.use("/address", addressRoutes);
rootRouter.use("/admin/products", adminRoutes);

module.exports = rootRouter;
