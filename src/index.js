const express = require("express");
const bodyParser = require("body-parser");
const createError = require("http-errors");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const { dbConnection, getMongoUrl } = require("./config/db");
const cors = require("cors");
const app = express();

// import router
const authRouter = require("./routes/auth-route");
const adminProductRouter = require("./routes/admin/product-route");
const userRouter = require("./routes/users-route");
const productRouter = require("./routes/product-route");
const cartRouter = require("./routes/cart-route");
const orderRouter = require("./routes/order-route");
const paymentRouter = require("./routes/payment-route");
const addressRouter = require("./routes/address-route");
const PORT = process.env.PORT ?? 5001;

const allowedOrigins = [
  "https://msjay-store.onrender.com",
  "http://localhost:3200",
];
const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

app.use(cors(corsOptions));
app.use("/img", express.static("img"));
app.use(express.urlencoded({ limit: "5mb", extended: false }));
app.use(bodyParser.json({ limit: "5mb" }));

// create session store
const store = new MongoDBStore({
  uri: getMongoUrl(),
  collection: "sessions",
});
// listen for error
store.on("error", (error) => {
  console.error(error);
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    name: "device",
    store,
    cookie: {
      secure: process.env.NODE_ENV === "development" ? false : true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    },
  })
);

// home route
app.get("/", (req, res) => {
  res.send("Welcome to Ms Jay Store!");
});

// route middleware
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/orders", orderRouter);
app.use("/api/paystack", paymentRouter);
app.use("/api/address", addressRouter);

// page not found handler
app.use((_req, _res, next) => {
  next(createError.NotFound("Page Not Found!"));
});

// error handler
app.use((err, _req, res, _next) => {
  res.status(err.status ?? 500).json({
    status: err.status,
    success: false,
    message: err.message,
  });
});

// connect to db
dbConnection()
  .then(() => {
    console.log("connected to db...");
    app.listen(PORT, () => console.log(`server running on port: ${PORT}`));
  })
  .catch((err) => console.error(err.message));
