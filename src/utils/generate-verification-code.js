function generateVerificationCode() {
  const verificationCode = Math.random().toFixed(6).split(".")[1];
  return verificationCode;
}
module.exports = generateVerificationCode;
