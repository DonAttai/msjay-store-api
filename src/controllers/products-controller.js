const createError = require("http-errors");
const Product = require("../models/Product");
const {
  createProductSchema,
  updateProductSchema,
} = require("../helpers/validation-schema");

// get all products
const getAllProducts = async (req, res, next) => {
  let { page, size } = req.query;
  if (!page) {
    page = 1;
  }
  if (!size) {
    size = 8;
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

// create a produuct
const createProduct = async (req, res, next) => {
  if (req.user?.roles.includes("admin")) {
    try {
      const productData = await createProductSchema.validateAsync(req.body);

      // check if product exists
      const product = await Product.findOne({ title: productData.title });
      if (product) {
        return next(createError.Conflict());
      }
      // create product
      const newProduct = await Product.create(productData);
      res.status(201).json(newProduct);
    } catch (error) {
      if (error.isJoi === true) {
        error.status = 422;
      }
      next(error);
    }
  } else {
    next(createError.Unauthorized());
  }
};

// delete product by id
const deleteProduct = async (req, res, next) => {
  if (req.user?.roles.includes("admin")) {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(createError.NotFound());
    }

    await product.deleteOne({ _id: product._id });
    res.status(204).json({});
  } else {
    next(createError.Unauthorized());
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

const updateProduct = async (req, res, next) => {
  if (req.user.roles.includes("admin")) {
    try {
      const productData = await updateProductSchema.validateAsync(req.body);
      const product = await Product.findById(req.params.id.toString());
      if (!product) {
        return next(createError.NotFound());
      }
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        productData,
        { new: true }
      );

      res.status(200).json(updatedProduct);
    } catch (error) {
      next(error);
    }
  } else {
    next(createError.Unauthorized());
  }
};
module.exports = {
  getAllProducts,
  createProduct,
  deleteProduct,
  getProductById,
  updateProduct,
};
