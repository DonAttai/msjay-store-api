const jwt = require("jsonwebtoken");
const createError = require("http-errors");

// verify access token
const verifyAccessToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(createError.Unauthorized("Unauthorised, no token"));
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      return next(createError.Unauthorized("Invalid token"));
    }
    req.user = payload;
    next();
  });
};

// verify access toke and authorize current user or admin
const verifyAccessTokenAndAuthorization = async (req, res, next) => {
  verifyAccessToken(req, res, () => {
    if (req.user?.id === req.params.id || req.user?.isAdmin) {
      next();
    } else {
      next(createError.Unauthorized("Access Denied"));
    }
  });
};

// verify access token and authorise admin
const verifyAccessTokenAndAdmin = async (req, res, next) => {
  verifyAccessToken(req, res, () => {
    if (req.user?.isAdmin) {
      next();
    } else {
      next(createError.Unauthorized("Access Denied"));
    }
  });
};

module.exports = {
  verifyAccessToken,
  verifyAccessTokenAndAuthorization,
  verifyAccessTokenAndAdmin,
};
