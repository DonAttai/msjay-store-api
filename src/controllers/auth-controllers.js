const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../models/User");
const {
  registerSchema,
  loginSchema,
  forgetPasswordSchema,
  resetPasswordSchema,
} = require("../helpers/validation-schema");
const {
  sendVerificationEmail,
  sendForgetPasswordEmail,
} = require("../utils/send-email");

let URL;
if (process.env.NODE_ENV === "developmet") {
  URL = process.env.LOCAL_URL;
} else {
  URL = process.env.URL;
}

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
    userData.password = await bcrypt.hash(userData.password, salt);

    // create user
    const user = new User(userData);

    // generate token to verify email
    const secret = process.env.JWT_SECRET + user.isVerified;
    const token = jwt.sign({ email: user.email }, secret, { expiresIn: "24h" });

    // send verification email
    sendVerificationEmail(user, token)
      .then(() => {
        user.save();
        res.status(201).json({
          message: "A link has been sent to your email for verification",
        });
      })
      .catch((error) => {
        throw error;
      });
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
    if (!user) return next(createError.NotFound("Invalid Credentials"));

    // compare password
    const isValidPassword = await bcrypt.compare(
      userData.password,
      user.password
    );

    if (!isValidPassword)
      return next(createError.Unauthorized("Invalid Credentials"));

    res.status(200).json({
      _id: user.id,
      email: user.email,
      username: user.username,
      isVerified: user.isVerified,
      roles: user.roles,
      accessToken: generateAccessToken(user),
    });
  } catch (error) {
    if (error.isJoi === true) {
      error.status = 422;
    }
    next(error);
  }
};

// forget password
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = await forgetPasswordSchema.validateAsync(req.body);

    // find user
    const user = await User.findOne({ email });

    if (!user) return next(createError.NotFound());

    // generate token to reset  password
    const secret = process.env.JWT_SECRET + user.password;
    const token = jwt.sign({ id: user.id }, secret, { expiresIn: "15m" });

    // send email
    sendForgetPasswordEmail(user, token)
      .then(() => {
        res
          .status(200)
          .json({ message: "Reset password link has been sent to your email" });
      })
      .catch((error) => {
        throw error;
      });
  } catch (error) {
    next(error);
  }
};

// reset password
const resetPassword = async (req, res, next) => {
  const { id, token } = req.params;
  try {
    const { password } = await resetPasswordSchema.validateAsync(req.body);

    // find user
    const user = await User.findById(id);
    if (!user) return next(createError.NotFound("User does not exists"));

    const secret = process.env.JWT_SECRET + user.password;
    jwt.verify(token, secret, (error, payload) => {
      if (error) return next(createError.Unauthorized("Invalid token"));
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    res.json({ message: "You have successflly changed your password" });
  } catch (error) {
    next(error);
  }
};

// verify email
const verifyEmail = async (req, res, next) => {
  const { id, token } = req.params;
  const body = req.body;
  console.log(body);

  try {
    const user = await User.findById(id);
    if (!user) return next(createError.NotFound("User not found! "));
    const secret = process.env.JWT_SECRET + user.isVerified;
    const decode = jwt.verify(token, secret);
    if (user.email !== decode.email) return next(createError.Forbidden());

    // verify user
    user.isVerified = true;

    // save user
    await user.save();

    res.status(200).json({
      _id: user.id,
      email: user.email,
      username: user.username,
      isVerified: user.isVerified,
      role: user.role,
      accessToken: generateAccessToken(user),
    });
  } catch (error) {
    next(error);
  }
};

// generate access token
const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
