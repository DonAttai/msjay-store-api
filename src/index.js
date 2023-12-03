const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const createError = require("http-errors");
const dbConnection = require("./config/db");
const cors = require("cors");
const app = express();

// import router
const authRouter = require("./routes/auth-route");
const usersRouter = require("./routes/users-route");
const productsRouter = require("./routes/product-route");

const PORT = process.env.PROT ?? 3003;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Welcome to Ms Jay Store!");
});
// route middleware
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/products", productsRouter);

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
