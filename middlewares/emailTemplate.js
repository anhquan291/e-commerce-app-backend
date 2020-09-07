const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secure: true,
  auth: {
    user: process.env.EMAIL_LOGIN,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const getPasswordResetURL = (user, token) =>
  `http://192.168.0.27:8080/expo?userid=${user._id}&token=${token}`;

const resetPasswordTemplate = (user, url) => {
  const from = process.env.EMAIL_LOGIN;
  const to = user.email;
  const subject = "🍀 CatTuong Password Reset 🍀";
  const html = ` 
  <p>Dear, ${user.name || user.email},</p>
  <p>Did you forget your password ?</p>
  <p> You can use the following link to reset your password:</p>
  <a href='${url}'>Click to Reset Your Password</a>
  <p>This link will expire in 15 minutes and can be used only once.</p>
  <p>If you don't want to change your password, please ignore and delete this message! </p>
  <p>Thank you,</p>
  <p>Your friend CatTuong 🍀</p>
  <img src="https://i.imgur.com/kST2Gn4.png" alt="logo" width="500" height="160" > 
  `;

  return { from, to, subject, html };
};

const registerUserTemplate = (user) => {
  const from = process.env.EMAIL_LOGIN;
  const to = user.email;
  const subject = "🍀 Đăng Ký Tài Khoản Thành Công 🍀";
  const html = `
  <p>Dear, ${user.name} </p>
  <p>Thank you for registering for shopping at our store </p>
  <p>Your username is: ${user.email} </p>
  <p>If you have any questions please contact support</p>
  <p>Best regards,</p>
  <p>Your friend CatTuong 🍀</p>
  <img src="https://i.imgur.com/kST2Gn4.png" alt="logo" width="500" height="60" > 
  `;

  return { from, to, subject, html };
};

const sendUserOrderTemplate = (data, user) => {
  const from = process.env.EMAIL_LOGIN;
  const to = user.email;
  const subject = "🍀 Đặt hàng thành công, thông tin đơn hàng của bạn 🍀";
  const html = `
  
  <p>Dear, Customer </p>
  <p>Your order ID is: ${data._id} </p>
  <p>Status: ${data.status} </p>
  <p>Items ordered: ${data.items.length} </p>
  <p>Total: ${data.totalAmount} </p>
  <p>We will check your order and confirm it as soon as possible</p>
  <p>Thanks for choosing our store </p>
  <p>Warm hugs,</p>
  <p>Your friend CatTuong 🍀</p>
  <img src="https://i.imgur.com/kST2Gn4.png" alt="logo" width="500" height="60" > 
  `;

  return { from, to, subject, html };
};
module.exports = {
  transporter,
  getPasswordResetURL,
  resetPasswordTemplate,
  sendUserOrderTemplate,
  registerUserTemplate,
};
