const express = require("express");
require("dotenv").config();
const createError = require("http-errors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const { connectDB, getMongoUrl } = require("./config/db");
const cors = require("cors");
const app = express();

// import root router
const rootRouter = require("./routes");
const PORT = process.env.PORT ?? 5001;

const allowedOrigins = [
  process.env.CLIENT_URL_REMOTE,
  process.env.CLIENT_URL_LOCAL,
];
const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

app.use(cookieParser());
app.use(cors(corsOptions));
app.use("/img", express.static("img"));
app.use(express.urlencoded({ limit: "5mb", extended: false }));
app.use(express.json({ limit: "5mb" }));

// create session store
const store = new MongoDBStore({
  uri: getMongoUrl(),
  collection: "sessions",
});
// listen for error
store.on("error", (error) => {
  console.error(error);
});

app.set("trust proxy", true);

// express session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    name: "device",
    store,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: process.env.NODE_ENV === "development" ? "strict" : "none",
    },
  })
);

// home route
app.get("/", (_req, res) => {
  res.send("Welcome to Ms Jay Store!");
});
// route middleware
app.use("/api", rootRouter);

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
connectDB()
  .then((conn) => {
    console.log(`MongoDB Connected on Port: ${conn.connection.port}`);
    app.listen(PORT, () => console.log(`server running on port: ${PORT}`));
  })
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
