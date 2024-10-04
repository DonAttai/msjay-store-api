const mongoose = require("mongoose");
const ROLE = {
  ADMIN: "admin",
  USER: "user",
};
const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: [ROLE.ADMIN, ROLE.USER], default: ROLE.USER },
    isVerified: { type: Boolean, default: true },
    verificationCode: String,
    verificationCodeExpiresAt: Date,
    resetPasswordToken: String,
    resetPasswordTokenExpiresAt: Date,
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
module.exports = { ROLE, User };
