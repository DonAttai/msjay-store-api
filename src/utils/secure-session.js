function secureSession() {
  let secure;
  if (process.env.NODE_ENV === "development") {
    secure = false;
  } else {
    secure = true;
  }
  return secure;
}
module.exports = secureSession;
