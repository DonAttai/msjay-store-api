const { uploadImage } = require("../../config/cloudinary");
const {
  updateProductSchema,
  createProductSchema,
} = require("../../helpers/validation-schema");
const Product = require("../../models/Product");
const createError = require("http-errors");

// create a produuct
const addProduct = async (req, res, next) => {
  try {
    const productData = await createProductSchema.validateAsync(req.body);

    // check if product exists
    const product = await Product.findOne({ title: productData.title });
    if (product) {
      return next(createError.Conflict());
    }

    const image = await uploadImage(productData.image);

    // create product
    if (image) {
      await Product.create({
        ...productData,
        image: image.secure_url,
      });
      return res.status(201).json({ message: "Product created successfully" });
    }
    next(createError.InternalServerError());
  } catch (error) {
    if (error.isJoi === true) {
      error.status = 422;
    }
    next(error);
  }
};

const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

// update product
const updateProduct = async (req, res, next) => {
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
};
// delete product by id
const deleteProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(createError.NotFound());
  }

  await product.deleteOne({ _id: product._id });
  res.status(204).json({});
};

module.exports = {
  getAllProducts,
  addProduct,
  deleteProduct,
  updateProduct,
};
