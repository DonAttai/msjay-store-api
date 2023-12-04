const bcrypt = require("bcrypt");
const createError = require("http-errors");
const User = require("../models/User");
const {
  passwordSchema,
  isAdminSchema,
} = require("../helpers/validation-schema");

//Get all users
const getAllUsers = async (req, res, next) => {
  if (req.user.isAdmin) {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  } else {
    next(createError.Unauthorized("You are not authorised to view this page"));
  }
};

// Update user
const updateUser = async (req, res, next) => {
  const { password, isAdmin } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(createError.NotFound("User Not Found"));
  }

  try {
    //   Update password
    if (password !== undefined) {
      try {
        const userData = await passwordSchema.validateAsync(req.body);
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(userData.password, salt);
        await user.save();
        res.status(200).json({ messsage: "Successfully changed password" });
      } catch (error) {
        if (error.isJoi === true) {
          error.status = 422;
        }
        throw error;
      }
    }

    //   Update user role -> only Admin
    if (req.user.isAdmin && isAdmin !== undefined) {
      try {
        const userData = await isAdminSchema.validateAsync(req.body);
        if (req.params.id === req.user.id) {
          return next(
            createError.Forbidden(
              "You can't remove yourself as an Admin, another Admin should"
            )
          );
        }
        user.isAdmin = userData.isAdmin;
        await user.save();
        res.status(200).json({ message: "Successfully changed user role" });
      } catch (error) {
        if (error.isJoi === true) {
          error.status = 422;
        }
        throw error;
      }
    } else {
      throw createError.Unauthorized("You are not an Admin user ");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { updateUser, getAllUsers };
