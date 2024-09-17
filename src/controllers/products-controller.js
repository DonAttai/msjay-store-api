const createError = require("http-errors");
const Product = require("../models/Product");

// get all products
const getAllProducts = async (req, res, next) => {
  let { page, size } = req.query;
  if (!page) {
    page = 1;
  }
  if (!size) {
    size = 10;
  }
  const skip = (page - 1) * size;
  const limit = +size;
  const category = req.query.category;
  const order = req.query.order === "desc" ? -1 : 1;
  try {
    let products;
    if (category) {
      products = await Product.find({ category })
        .sort({ createdAt: order })
        .limit(limit)
        .skip(skip);
    } else {
      products = await Product.find()
        .sort({ createdAt: order })
        .limit(limit)
        .skip(skip);
    }
    res.status(200).json({ page, size, products });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(createError.NotFound());
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getAllProducts,
  getProductById,
};
