const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const { ROLE } = require("../models/User");

const isAuthenticated = (req, res, next) => {
  const token = req.cookies && req.cookies.accessToken;

  if (token) {
    const { JWT_SECRET: secret } = process.env;
    jwt.verify(token, secret, (err, payload) => {
      if (err) {
        return next(createError.Unauthorized("Invalid Access Token"));
      }
      req.user = payload;
      next();
    });
  } else {
    next(createError.Unauthorized("No Access Token"));
  }
};

// check user
const checkUser = (req, res, next) => {
  const token = req.cookies && req.cookies.accessToken;

  if (token) {
    const { JWT_SECRET: secret } = process.env;
    jwt.verify(token, secret, (err, payload) => {
      if (err) {
        return next(createError.Unauthorized("Invalid Access Token"));
      }
      req.user = payload;
    });
  } else {
    req.user = null;
  }
  next();
};

const checkRole = (roles) => {
  return (req, res, next) => {
    const role = req.user?.role;
    if (roles.includes(role)) {
      next();
    } else {
      next(createError.Unauthorized("You are not authorised"));
    }
  };
};

const getCurrentUserOrAdmin = () => {
  return (req, res, next) => {
    const role = req.user?.role;
    const currentUser = req.user.id === req.params.id;
    if (role === ROLE.ADMIN || currentUser) {
      next();
    } else {
      next(createError.Unauthorized("You are not authorised"));
    }
  };
};

//

module.exports = {
  checkRole,
  getCurrentUserOrAdmin,
  isAuthenticated,
  checkUser,
};
