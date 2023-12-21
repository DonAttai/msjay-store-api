const resetPasswordTemplate = ({ username, link, brandName }) => {
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          font-size: 16px;
        }
    
        .container {
          width: 500px;
          margin: 0 auto;
          padding: 20px;
        }
    
        a {
        color: #fff;
        display: inline-block;
        background-color: #38a169;
        padding: 10px 20px;
        font-weight: bold;
        text-align: center;
        border-radius: 5px;
        text-decoration: none;
        }
     
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Reset Your Password</h1>
        <p>Hi ${username},</p>
        <p>We received a request to reset your password for your ${brandName} account. Click the button below to create a new password.</p>
        <p><a href="${link}" target="_blank">Reset Password</a></p>
        <p>If you didn't request a password reset, please ignore this email. Your password will remain secure.</p>
        <p>Thanks,</p>
        <p>The ${brandName} Team</p>
      </div>
    </body>
    </html>
    `;
};

const verifyEmailTemplate = ({ username, brandName, link }) => {
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${brandName} - Verify Your Email & Unlock Awesome Deals!</title>
      <style>
        body {
          font-family: sans-serif;
          margin: 0;
          padding: 0;
        }
        .container {
          padding: 20px;
          max-width: 600px;
          margin: 0 auto;
        }

        .content {
          padding: 20px;
          background-color: #fff;
          border-radius: 5px;
        }
        h1 {
          font-size: 24px;
          margin-bottom: 10px;
        }
        p, ul {
          font-size: 16px;
          line-height: 1.5;
        }
        .button {
          display: block;
          width: 200px;
          padding: 10px 20px;
          background-color: #3cb043;
          color: #fff;
          font-size: 1.5rem;
          font-weight: bold;
          text-align: center;
          cursor: pointer;
          border-radius: 5px;
          text-decoration: none;
          margin: 20px auto;
        }
        footer {
          text-align: center;
          font-size: 12px;
          color: #ccc;
          margin-top: 20px;
        }

      </style>
    </head>
    <body>
      <div class="container">
        <div class="content">
          <h1>✨ Almost There! Verify Your Email to Unlock ${brandName}</h1>
          <p>Hi ${username},</p>
          <p>Welcome to ${brandName}! We're thrilled you've signed up, but before you can start shopping our amazing products, we just need to verify your email address.</p>
          <p>Just click the button below to confirm it's you:</p>
          <a href="${link}" target="_blank" class="button" >Verify Email</a>
          <p>Once you verify, you'll unlock:</p>
          <ul>
            <li>Exclusive deals and discounts!</li>
            <li>Personalized product recommendations.</li>
            <li>Faster checkout with your saved information.</li>
          </ul>
          <p>Don't worry, we take your privacy seriously and promise never to spam you.</p>
          <p>If you didn't create an account, simply ignore this email.</p>
          <p>Happy Shopping!</p>
          <p>The Team at ${brandName}</p>
        </div>
        <footer>
          © ${brandName} ${new Date().getFullYear()}. All rights reserved.
        </footer>
      </div>
    </body>
    </html>
    `;
};

module.exports = { resetPasswordTemplate, verifyEmailTemplate };
