const mongoose = require("mongoose");

const GuestUserSchema = new mongoose.Schema({
  role: {
    type: String,
    default: "guest user",
    required: true,
  },
});

const GuestUser = mongoose.model("GuestUser", GuestUserSchema);
module.exports = GuestUser;
