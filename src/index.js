const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const createError = require("http-errors");
const dbConnection = require("./config/db");
const cors = require("cors");
const app = express();

// import router
const authRouter = require("./routes/auth-route");
const userRouter = require("./routes/users-route");
const productRouter = require("./routes/product-route");
const cartRouter = require("./routes/cart-route");
const orderRouter = require("./routes/order-route");

const PORT = process.env.PROT ?? 3003;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  console.log(req.user);
  res.send("Welcome to Ms Jay Store!");
});
// route middleware
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/orders", orderRouter);

app.use((req, res, next) => {
  next(createError.NotFound("Page Not Found"));
});

app.use((err, req, res, next) => {
  res.status(err.status ?? 500).json({
    status: err.status,
    message: err.message,
  });
  next();
});

// connect to db
dbConnection()
  .then(() => {
    console.log("connected to db...");
    app.listen(PORT, () => console.log(`server running on port: ${PORT}`));
  })
  .catch((err) => console.log(err.message));
