const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const createError = require("http-errors");
const dbConnection = require("./config/db");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
const axios = require("axios");

// import router
const authRouter = require("./routes/auth-route");
const userRouter = require("./routes/users-route");
const productRouter = require("./routes/product-route");
const cartRouter = require("./routes/cart-route");
const orderRouter = require("./routes/order-route");
const paymentRouter = require("./routes/payment-route");
const PORT = process.env.PROT ?? 3003;

const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    if (["http://localhost:3200"].indexOf(origin !== -1)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));
app.use("/img", express.static("img"));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

// home route
app.get("/", (req, res) => {
  res.send("Welcome to Ms Jay Store!");
});

// route middleware
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/orders", orderRouter);
app.use("/api/paystack", paymentRouter);

// page not found handler
app.use((req, res, next) => {
  next(createError.NotFound("Page Not Found"));
});

// error handler
app.use((err, req, res, next) => {
  res.status(err.status ?? 500).json({
    status: err.status,
    message: err.message,
  });
});

// connect to db
dbConnection()
  .then(() => {
    console.log("connected to db...");
    app.listen(PORT, () => console.log(`server running on port: ${PORT}`));
  })
  .catch((err) => console.log(err.message));
