const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { registerSchema, loginSchema } = require("../helpers/validation-schema");

// Register
const register = async (req, res, next) => {
  try {
    const userData = await registerSchema.validateAsync(req.body);

    // check by username if user exists
    const usernameExist = await User.findOne({ username: userData.username });
    if (usernameExist) {
      return next(
        createError.Conflict(`${userData.username} has already been taken`)
      );
    }

    // check by email if user exists
    const emailExist = await User.findOne({ email: userData.email });

    if (emailExist) {
      return next(
        createError.Conflict(`${userData.email} has already been taken`)
      );
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    userData.password = hashedPassword;

    // create user
    const user = await User.create(userData);

    const { password, ...rest } = user._doc;
    res.status(201).json(rest);
  } catch (error) {
    if (error.isJoi == true) {
      error.status = 422;
    }
    next(error);
  }
};

//   Login
const login = async (req, res, next) => {
  try {
    const userData = await loginSchema.validateAsync(req.body);

    // check if user exists
    const user = await User.findOne({ username: userData.username });
    if (!user) {
      return next(createError.NotFound("Invalid Credentials"));
    }

    // compare password
    const isValidPassword = await bcrypt.compare(
      userData.password,
      user.password
    );

    if (!isValidPassword) {
      return next(createError.Unauthorized("Invalid Credentials"));
    }

    // generate access token
    const accessToken = jwt.sign(
      { id: user.id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    const { password, ...rest } = user._doc;
    res.status(200).json({ ...rest, accessToken });
  } catch (error) {
    if (error.isJoi === true) {
      //   return next(createError.BadRequest("Invalid Credentials"));
      error.status = 422;
    }
    next(error);
  }
};

module.exports = { register, login };
