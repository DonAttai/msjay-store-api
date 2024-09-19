const bcrypt = require("bcrypt");
const createError = require("http-errors");
const { User, ROLE: Role } = require("../models/User");
const { passwordSchema } = require("../helpers/validation-schema");
const { default: mongoose } = require("mongoose");

//Get all users
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
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

// get user with address
const getUserWithAddress = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const userWithAddress = await fetchUserWithAddress(userId);
    res.json(userWithAddress);
  } catch (error) {
    next(error);
  }
};

//
async function fetchUserWithAddress(userId) {
  const userWithAddress = await User.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(userId) }, // Find the user by their userId
    },
    {
      $lookup: {
        from: "addresses", // Name of the address collection
        localField: "_id", // Field from the user collection
        foreignField: "userId", // Field from the address collection
        as: "addresses", // The name for the array containing addresses
      },
    },
    {
      $unwind: "$addresses", // Optional: Use this if each user has only one address
    },
  ]);

  return userWithAddress;
}

module.exports = {
  updateUser,
  getAllUsers,
  getUserById,
  getUsersStats,
  deleteUser,
  getUserWithAddress,
};
