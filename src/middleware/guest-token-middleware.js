const { randomUUID } = require("crypto");
const jwt = require("jsonwebtoken");

function generateGuestToken() {
  guestId = randomUUID();
  const { GUEST_USER_JWT_SECRET: secret } = process.env;
  return jwt.sign({ guestId }, secret, { expiresIn: "7d" });
}

const guestTokenMiddleware = (req, res, next) => {
  // Check if the guest token is already present in cookies
  const guestToken = req.cookies && req.cookies.guestToken;

  if (!guestToken) {
    // Generate a new guest token if not present
    const newGuestToken = generateGuestToken();

    // Set the guest token as an HTTP-only cookie
    res.cookie("guestToken", newGuestToken, {
      httpOnly: true, // Prevent access by JavaScript
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      secure: process.env.NODE_ENV === "production", // Only use HTTPS in production
      sameSite: "strict", // Prevent CSRF attacks
    });
  }

  next();
};

module.exports = { guestTokenMiddleware };
