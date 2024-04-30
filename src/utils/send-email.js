const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");

const mailerSend = new MailerSend({
  apiKey: process.env.API_KEY,
});
const sentFrom = new Sender(
  "msjaystore@trial-neqvygm968wl0p7w.mlsender.net",
  "MsJay Store"
);

// send verification email
const sendVerificationEmail = async (user, token) => {
  const recipients = [new Recipient(user.email, user.username.toUpperCase())];
  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setReplyTo(sentFrom)
    .setSubject("Email Verification")
    .setHtml(
      `<p>Hello ${user.username.toUpperCase()}, click the link below to verify your email:
  ${process.env.CLIENT_URL_LOCAL}/verify-email/${user._id}/${token}
  </P>
  `
    );
  try {
    const result = await mailerSend.email.send(emailParams);
    return result;
  } catch (error) {
    console.log(error);
  }
};

// send forget password email
const sendForgetPasswordEmail = async (user, token) => {
  const recipients = [new Recipient(user.email, user.username.toUpperCase())];
  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setReplyTo(sentFrom)
    .setSubject("Reset Password")
    .setHtml(
      `<p>Hello ${user.username.toUpperCase()}, click the link below to reset your password:
  ${process.env.CLIENT_URL_LOCAL}/reset-password/${user._id}/${token}
  </P>
  `
    );
  try {
    const result = await mailerSend.email.send(emailParams);
    return result;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { sendVerificationEmail, sendForgetPasswordEmail };