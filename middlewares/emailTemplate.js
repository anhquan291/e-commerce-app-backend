const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_LOGIN,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const getPasswordResetURL = (user, token) =>
  `http://localhost:3000/password/reset/${user._id}/${token}`;
const resetPasswordTemplate = (user, url) => {
  const from = process.env.EMAIL_LOGIN;
  const to = user.email;
  const subject = '🌻 CatTuong Password Reset 🌻';
  const html = `
  <p>Hey ${user.name || user.email},</p>
  <p>We heard that you lost your Stone App password. Sorry about that!</p>
  <p>But don’t worry! You can use the following link to reset your password:</p>
  <a href=${url}>${url}</a>
  <p>If you don’t use this link within 15 minutes, it will expire.</p>
  <p>Get your lucky bracelet in CatTuong Store ! </p>
  <p>–Your friends CatTuong</p>
  `;

  return { from, to, subject, html };
};
module.exports = { transporter, getPasswordResetURL, resetPasswordTemplate };
