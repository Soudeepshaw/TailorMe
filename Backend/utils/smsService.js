const twilio = require('twilio');
const config = require('../config/config');

const client = twilio(config.twilioAccountSid, config.twilioAuthToken);

exports.sendSMS = async (to, body) => {
  try {
    await client.messages.create({
      body,
      from: config.twilioPhoneNumber,
      to
    });
    console.log('SMS sent successfully');
  } catch (error) {
    console.error('Error sending SMS:', error);
  }
};