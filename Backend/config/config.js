require('dotenv').config();
module.exports = {
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: '1d',
  bcryptSaltRounds: 10,
  emailFrom: process.env.EMAIL_FROM,
  smtpHost: process.env.SMTP_HOST,
  smtpPort: process.env.SMTP_PORT,
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  frontendUrl: process.env.FRONTEND_URL,
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
  twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER
};