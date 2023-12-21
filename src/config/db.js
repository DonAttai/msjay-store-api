const mongoose = require("mongoose");

let DB_URI;
if (process.env.NODE_ENV === "development") {
  DB_URI = process.env.MONGO_URI;
} else {
  DB_URI = process.env.MONGO_ATLAS_URI;
}
const dbConnection = async () => {
  return await mongoose.connect(DB_URI, {});
};

module.exports = dbConnection;
