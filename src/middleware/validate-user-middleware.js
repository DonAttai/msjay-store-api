const { compare } = require("bcrypt");
const { User } = require("../models/User");
const createError = require("http-errors");
const { loginSchema } = require("../helpers/validation-schema");

const validateUser = async (req, res, next) => {
  try {
    const userData = await loginSchema.validateAsync(req.body);
    const { email, password } = userData;

    const user = await User.findOne({ email });
    if (user && (await compare(password, user.password))) {
      // req.user = { ...user._doc, password: null };
      req.user = user;
      next();
    } else {
      next(createError.NotFound("Invalid Credentials"));
    }
  } catch (error) {
    next(error);
  }
};

module.exports = validateUser;
