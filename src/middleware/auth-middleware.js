const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const { ROLE } = require("../models/User");

// verify access token
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  let token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    req.user = null;
    return next();
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) return next(createError.Unauthorized("Invalid token"));
    req.user = payload;
    next();
  });
};

const isAuthenticated = (req, res, next) => {
  const authHeader =
    req.headers.authorization && req.headers.authorization.startsWith("Bearer");

  if (authHeader) {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        if (err) return next(createError.Unauthorized("Invalid token"));
      }
      req.user = payload;
    });
  } else {
    if (req.signedCookies.device) {
      req.user = { id: req.signedCookies.device, role: "guest user" };
    }
  }

  if (req.user) {
    next();
  } else {
    next(createError.Unauthorized());
  }
};

const checkRole = (roles) => {
  return (req, res, next) => {
    const role = req.user?.role;
    if (roles.includes(role)) {
      next();
    } else {
      res.status(401).json({ message: "You are not authorised" });
    }
  };
};

const currentUserOrAdmin = () => {
  return (req, res, next) => {
    const role = req.user?.role;
    const currentUser = req.user.id === req.params.id;
    if (role === ROLE.ADMIN || currentUser) {
      next();
    } else {
      res.status(401).json({ message: "You are not authorised" });
    }
  };
};

//

module.exports = {
  verifyToken,
  checkRole,
  currentUserOrAdmin,
  isAuthenticated,
};
