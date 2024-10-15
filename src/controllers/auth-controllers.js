const crypto = require("crypto");
const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../models/User");
const Cart = require("../models/Cart");
const {
  registerSchema,
  forgetPasswordSchema,
  resetPasswordSchema,
} = require("../helpers/validation-schema");

const generateVerificationCode = require("../utils/generate-verification-code");

// Register
const register = async (req, res, next) => {
  try {
    const userData = await registerSchema.validateAsync(req.body);

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
    const verificationCode = generateVerificationCode();
    const user = new User({
      ...userData,
      verificationCode,
      verificationCodeExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    // send verification email
    // await sendVerificationEmail(user.email, user.verificationCode)

    // save user
    await user.save();
    res
      .status(201)
      .json({ success: true, message: "Account created successfully" });
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
    // Check if there's a guest cart and merge it with the user's cart
    const guestCart = req.session.guestCart;
    const userCart = await Cart.findOne({ userId: req.user._id });

    if (guestCart && guestCart.products.length > 0) {
      if (userCart) {
        // Sync guest cart with the user's cart
        guestCart.products.forEach((guestProduct) => {
          const existingProduct = userCart.products.find(
            (p) => p.productId.toString() === guestProduct.productId.toString()
          );
          if (existingProduct) {
            // Update quantity if product exists
            existingProduct.quantity += guestProduct.quantity;
          } else {
            // Add new product to user's cart
            userCart.products.push(guestProduct);
          }
        });
        await userCart.save();
      } else {
        // If user has no cart, create a new one
        await Cart.create({
          userId: req.user._id,
          products: guestCart.products,
        });
      }
      // Clear guest cart session
      req.session.guestCart = null;
    }

    const user = req.user;
    // create access token
    const accessToken = generateAccessToken(user);

    // send cookie with token to client
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: process.env.NODE_ENV === "development" ? "strict" : "none",
    });

    res.status(200).json({
      _id: user._id,
      email: user.email,
      isVerified: user.isVerified,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  } catch (error) {
    if (error.isJoi === true) {
      error.status = 422;
    }
    next(error);
  }
};

const logOut = async (req, res, next) => {
  try {
    const token = req.cookies && req.cookies["accessToken"];
    if (token) {
      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "development" ? "strict" : "none",
      });
    }
    res.status(200).send({ message: "Logged out Successfully!" });
  } catch (error) {
    next(error);
  }
};

// forget password
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = await forgetPasswordSchema.validateAsync(req.body);

    // find user
    const user = await User.findOne({ email });

    if (!user) return next(createError.NotFound("User Not Found!"));

    // generate token to reset  password
    const token = crypto.randomBytes(32).toString("hex");
    const tokenExpiresAt = Date.now() + 60 * 60 * 1000; // 1 hour

    user.resetPasswordToken = token;
    user.resetPasswordToken = tokenExpiresAt;

    // send forgot password email
    const { CLIENT_URL_LOCAL, CLIENT_URL_REMOTE, NODE_ENV } = process.env;
    const CLIENT_URL =
      NODE_ENV === "development" ? CLIENT_URL_LOCAL : CLIENT_URL_REMOTE;
    // await sendPasswordResetemail(user.email, `${CLIENT_URL}/reset-password/${token}`)

    await user.save();
    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    next(error);
  }
};

// reset password
const resetPassword = async (req, res, next) => {
  const { token } = req.params;
  try {
    const { password } = await resetPasswordSchema.validateAsync(req.body);

    // find user
    const user = await User.findOne({ resetPasswordToken: token });

    if (!user || Date.now() > user?.resetPasswordTokenExpiresAt) {
      return next(createError(400, "Invalid or expired reset token"));
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiresAt = undefined;

    // await sendPasswordRestSuccessEmail(user.email);
    await user.save();
    res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    next(error);
  }
};

// verify email
const verifyEmail = async (req, res, next) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({ verificationCode: code });
    if (!user || Date.now() > user?.verificationCodeExpiresAt) {
      return next(createError(400, "Invalid or expired verification code"));
    }

    // verify user
    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpiresAt = undefined;

    // send welcome email
    // await sendWelcomeEmail(user.email, user.firstName)

    // save user
    await user.save();

    res.status(200).json({
      _id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
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
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "24h",
    }
  );
};

module.exports = {
  register,
  login,
  logOut,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
