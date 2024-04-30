const mongoose = require("mongoose");
const ROLE = {
  ADMIN: "admin",
  USER: "user",
};
const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, lowercase: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    address: {
      city: String,
      street: String,
      number: Number,
    },
    Phone: { type: String },
    role: { type: String, enum: [ROLE.ADMIN, ROLE.USER], default: ROLE.USER },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
module.exports = { ROLE, User };
