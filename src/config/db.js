const mongoose = require("mongoose");

let URI;
if (process.env.NODE_ENV === "development") {
  URI = process.env.MONGO_URI;
} else {
  URI = MONGO_ATLAS_URI;
}
const dbConnection = async () => {
  return await mongoose.connect(URI, {});
};

module.exports = dbConnection;
