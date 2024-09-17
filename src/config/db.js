const mongoose = require("mongoose");

function getDBURI() {
  if (process.env.NODE_ENV === "development") {
    return process.env.MONGO_URI;
  }
  return process.env.MONGO_ATLAS_URI;
}

const dbConnection = async () => {
  const MONGO_URI = getDBURI();
  return await mongoose.connect(MONGO_URI);
};

module.exports = { dbConnection, getDBURI };
