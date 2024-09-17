const createError = require("http-errors");
const Address = require("../models/Address");
const { addressSchema } = require("../helpers/validation-schema");

// create user address
const addAddress = async (req, res, next) => {
  try {
    const addressData = await addressSchema.validateAsync(req.body);
    await Address.create({ ...addressData, userId: req.user.id });
    res.status(201).json({ message: "Successfully added address" });
  } catch (error) {
    next(error);
  }
};

// get user address
const getUserAddress = async (req, res, next) => {
  try {
    const address = await Address.findOne({ userId: req.params.userId });
    if (!address) {
      return next(createError.NotFound("address not found"));
    }
    res.status(200).json(address);
  } catch (error) {
    next(error);
  }
};

// update user address
const updateUserAddress = async (req, res, next) => {
  const addressId = req.params.id;

  try {
    const addressData = await addressSchema.validateAsync(req.body);
    const address = await Address.findById({ _id: addressId });
    if (!address) {
      return next(createError.NotFound("address not found"));
    }
    await Address.findByIdAndUpdate(addressId, addressData, { new: true });
    res.status(200).json({ message: "address update successful" });
  } catch (error) {
    next(error);
  }
};
module.exports = { addAddress, getUserAddress, updateUserAddress };
