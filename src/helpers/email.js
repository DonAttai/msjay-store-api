const brevo = require("@getbrevo/brevo");
const { resetPasswordTemplate, verifyEmailTemplate } = require("./template");

const apiInstance = new brevo.TransactionalEmailsApi();

let apiKey = apiInstance.authentications["apiKey"];
apiKey.apiKey = process.env.EMAIL_API_KEY;

let sendSmtpEmail = new brevo.SendSmtpEmail();

// forget password emai template
const sendForgetPasswordEmail = async ({ email, link, name }) => {
  sendSmtpEmail.subject = "Reset Password";
  sendSmtpEmail.htmlContent = resetPasswordTemplate({
    username: name,
    link,
    brandName: "Ms Jay Store",
  });
  sendSmtpEmail.sender = {
    name: "Ms Jay Store",
    email: "noreply@msjaystore.com",
  };
  sendSmtpEmail.to = [{ email, name }];
  sendSmtpEmail.replyTo = {
    email: "noreply@msjaystore.com",
    name: "Ms Jay Store",
  };
  // sendSmtpEmail.params = {   };
  try {
    return await apiInstance.sendTransacEmail(sendSmtpEmail);
  } catch (error) {
    throw error;
  }
};

// account verification email template
const sendAccountVerificationEmail = async ({ email, link, name }) => {
  sendSmtpEmail.subject = "Verify Email";
  sendSmtpEmail.htmlContent = verifyEmailTemplate({
    username: name,
    link,
    brandName: "Ms Jay Store",
  });
  sendSmtpEmail.sender = {
    name: "Ms Jay Store",
    email: "noreply@msjaystore.com",
  };
  sendSmtpEmail.to = [{ email, name }];
  sendSmtpEmail.replyTo = {
    email: "noreply@msjaystore.com",
    name: "Ms Jay Store",
  };
  // sendSmtpEmail.params = {   };
  try {
    return await apiInstance.sendTransacEmail(sendSmtpEmail);
  } catch (error) {
    throw error;
  }
};
module.exports = { sendForgetPasswordEmail, sendAccountVerificationEmail };
