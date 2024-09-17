const cloudinary = require("cloudinary").v2;

// configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImage(file) {
  cloudinary.uploader.upload_stream;
  const result = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
    folder: "msjay-store/products",
  });

  return result;
}

module.exports = { uploadImage };
