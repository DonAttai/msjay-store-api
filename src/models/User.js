const mongoose = require("mongoose");
const ROLE = {
  ADMIN: "admin",
  USER: "user",
};
const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    username: { type: String, required: true, unique: true, lowercase: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: [ROLE.ADMIN, ROLE.USER], default: ROLE.USER },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
module.exports = { ROLE, User };
