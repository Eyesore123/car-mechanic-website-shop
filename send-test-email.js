// For testing purposes only, send email with SendGrid using command 'node send-test-email.js'

const sgMail = require('@sendgrid/mail');
require('dotenv').config();

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  throw new Error('SENDGRID_API_KEY environment variable is not set');
}

const msg = {
  to: 'joni.a.putkinen@gmail.com', // Change to your recipient
  from: 'joni.putkinen@protonmail.com', // Change to your verified sender
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};

sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent');
  })
  .catch((error) => {
    console.error(error);
  });