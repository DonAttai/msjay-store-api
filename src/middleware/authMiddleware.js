const jwt = require("jsonwebtoken");
const createError = require("http-errors");

// verify access token
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return next(createError.Unauthorized("Unauthorised, no token"));
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) return next(createError.Unauthorized("Invalid token"));
    req.user = payload;
    next();
  });
};

module.exports = { verifyToken };
