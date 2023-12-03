const jwt = require("jsonwebtoken");
const createError = require("http-errors");

// verify access token
const verifyAccessToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(createError.Unauthorized());
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      return next(createError.Unauthorized());
    }
    req.user = payload;
    next();
  });
};

// verify access toke and authorize current user or admin
const verifyTokenAndAuthorize = async (req, res, next) => {
  verifyAccessToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      return next();
    }
    next(createError.Unauthorized());
  });
};

// verify token aon authorise admin
const verifyTokenAndAdmin = async (req, res, next) => {
  verifyAccessToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      return next();
    }
    next(createError.Unauthorized());
  });
};

module.exports = {
  verifyAccessToken,
  verifyTokenAndAuthorize,
  verifyTokenAndAdmin,
};
