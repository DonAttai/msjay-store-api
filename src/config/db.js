const mongoose = require("mongoose");

function getMongoUrl() {
  if (process.env.NODE_ENV === "development") {
    return process.env.MONGO_URI;
  }
  return process.env.MONGO_ATLAS_URI;
}

const dbConnection = async () => {
  return await mongoose.connect(getMongoUrl());
};

module.exports = { dbConnection, getMongoUrl };
