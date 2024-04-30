const bcrypt = require("bcrypt");
const createError = require("http-errors");
const { User, ROLE: Role } = require("../models/User");
const { passwordSchema } = require("../helpers/validation-schema");

//Get all users
const getAllUsers = async (req, res, next) => {
  let { page, size } = req.query;

  if (!page) {
    page = 1;
  }
  if (!size) {
    size = 10;
  }
  const limit = +size;

  const skip = (page - 1) * size;
  const order = req.query.order === "desc" ? -1 : 1;
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: order })
      .limit(limit)
      .skip(skip);
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// Get a single user by id
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return next(createError.NotFound("User not  found!"));
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

//  Get user statistics
const getUsersStats = async (req, res, next) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: { month: { $month: "$createdAt" } },
      },
      {
        $group: { _id: "$month", total: { $sum: 1 } },
      },
    ]);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// Update user
const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id || req.user.role !== Role.ADMIN) {
    return next(createError.Unauthorized());
  }
  // destructure data from request body
  const { password } = await passwordSchema(req.body.password);
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(createError.NotFound("User Not Found"));
  }

  try {
    //   Change user password
    try {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      res.status(200).json({ messsage: "Successfully changed password" });
    } catch (error) {
      if (error.isJoi === true) {
        error.status = 422;
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  if (req.user.id === req.params.id || req.user.role === Role.ADMIN) {
    const user = await User.findById(req.params.id);
    try {
      if (!user) return next(createError.NotFound("User not found!"));
      await User.deleteOne({ email: user.email });
      res.status(204).json({});
    } catch (error) {
      next(error);
    }
  } else {
    next(createError.Unauthorized());
  }
};

module.exports = {
  updateUser,
  getAllUsers,
  getUserById,
  getUsersStats,
  deleteUser,
};
