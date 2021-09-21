// const sgMail = require('@sendgrid/mail');
const nodemailer = require('nodemailer');
require('dotenv').config();

// class CreateSenderSendGrid {
//   async send(message) {
//     sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//     return await sgMail.send({ ...message, from: process.env.EMAIL_SENDGRID });
//   }
// };

class CreateSenderNodemailer {
  async send(message) {
    const config = {
      host: 'smtp.meta.ua',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    };
    const transporter = nodemailer.createTransport(config);
    return await transporter.sendMail({
      ...message,
      from: process.env.EMAIL,
    });
  };
};

module.exports = CreateSenderNodemailer;