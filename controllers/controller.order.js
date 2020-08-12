const Order = require('../models/order');
const User = require('../models/user');
const pushNotification = require('../middlewares/pushNotification');
const {
  transporter,
  sendUserOrderTemplate,
} = require('../middlewares/emailTemplate');

const order_get = (req, res) => {
  Order.find()
    .populate('items.item')
    .populate('userId')
    .then((data) => {
      return res.status(200).send({
        status: 'OK',
        message: 'Get Orders Successfully',
        content: data,
      });
    })
    .catch((err) => {
      return res.status(400).send({
        status: 'ERR_SERVER',
        message: err.message,
        content: null,
      });
    });
};
const order_post = (req, res) => {
  if (!req.body) {
    return res.status(200).send({
      status: 'ERR_REQUEST',
      message: 'Please check your request!',
      content: null,
    });
  }
  let content = {
    title: 'Cập nhật đơn hàng',
    body: `Đơn hàng của bạn đã được đặt thành công.`,
  };
  const order = new Order(req.body);
  order
    .save()
    .then((data) => {
      const sendEmail = () => {
        transporter.sendMail(sendUserOrderTemplate(data), (err, info) => {
          if (err) {
            res.status(500).send({ err: 'Error sending email' });
          }
          console.log(`** Email sent **`, info);
        });
      };
      sendEmail();
      User.findById(data.userId).then((user) => {
        pushNotification(user.pushTokens, content, '');
      });
      return res.status(200).send({
        status: 'OK',
        message: 'Added Order Successfully',
        content: data,
      });
    })
    .catch((err) => {
      return res.status(400).send({
        status: 'ERR_SERVER',
        message: err.message,
        content: null,
      });
    });
};
const order_update = (req, res) => {
  const { id } = req.params;
  const updateStatus = req.body.status;
  if (!req.params.id) {
    return res.status(200).send({
      status: 'ERR_REQUEST',
      message: 'Please check your ID request',
      content: null,
    });
  }
  let content = {
    title: 'Cập nhật đơn hàng',
    body: `Đơn hàng ${id.substr(id.length - 10)} đã được ${updateStatus}.`,
  };
  Order.findByIdAndUpdate(id, { status: updateStatus })
    .then((data) => {
      User.findById(data.userId).then((user) => {
        pushNotification(user.pushTokens, content, '');
      });
      return res.status(200).send({
        status: 'OK',
        message: 'Updated Order Successfully',
        content: data,
      });
    })
    .catch((err) => {
      return res.status(400).send({
        status: 'ERR_SERVER',
        message: err.message,
        content: null,
      });
    });
};

module.exports = {
  order_get,
  order_post,
  order_update,
};
