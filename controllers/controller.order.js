const Order = require("../models/order");
const User = require("../models/user");
const pushNotification = require("../middlewares/pushNotification");
const stripe = require("stripe")(process.env.STIPE_SECRET_TOKEN);
const { v4: uuidv4 } = require("uuid");
const {
  transporter,
  sendUserOrderTemplate,
} = require("../middlewares/emailTemplate");

const order_get = (req, res) => {
  Order.find()
    .populate("items.item")
    .populate("userId")
    .then((data) => {
      return res.status(200).send({
        status: "OK",
        message: "Get Orders Successfully",
        content: data,
      });
    })
    .catch((err) => {
      return res.status(400).send({
        status: "ERR_SERVER",
        message: err.message,
        content: null,
      });
    });
};
const order_post = async (req, res) => {
  const { items, totalAmount } = req.body.orderInfo;
  const { token } = req.body;
  const orders = items.map((item) => {
    return `itemID: ${item.item}, quantity:${item.quantity}`;
  });
  if (!req.body) {
    return res.status(200).send({
      status: "ERR_REQUEST",
      message: "Please check your request!",
      content: null,
    });
  }
  let content = {
    title: "Cập nhật đơn hàng",
    body: `Đơn hàng của bạn đã được đặt thành công.`,
  };

  const order = new Order(req.body.orderInfo);

  if (Object.keys(token).length !== 0) {
    try {
      stripe.charges.create({
        amount: totalAmount,
        currency: "usd",
        description: `Order Items: ${orders}`,
        source: token.id,
      });
    } catch (err) {
      res.send(err);
    }
  }
  try {
    const resOrder = await order.save();
    const user = await User.findById(resOrder.userId);
    pushNotification(user.pushTokens, content, "");
    transporter.sendMail(sendUserOrderTemplate(resOrder, user), (err, info) => {
      if (err) {
        res.status(500).send({ err: "Error sending email" });
      } else {
        console.log(`** Email sent **`, info);
      }
    });
    res.status(200).send({
      status: "OK",
      message: "Added Order Successfully",
      content: resOrder,
    });
  } catch (err) {
    return res.status(400).send({
      status: "ERR_SERVER",
      message: err.message,
      content: null,
    });
  }
};
const order_update = async (req, res) => {
  const { id } = req.params;
  const updateStatus = req.body.status;
  if (!req.params.id) {
    return res.status(200).send({
      status: "ERR_REQUEST",
      message: "Please check your ID request",
      content: null,
    });
  }
  let content = {
    title: "Cập nhật đơn hàng",
    body: `Đơn hàng ${id.substr(id.length - 10)} đã được ${updateStatus}.`,
  };
  try {
    const resOrder = await Order.findByIdAndUpdate(id, {
      status: updateStatus,
    });
    const user = User.findById(resOrder.userId);
    pushNotification(user.pushTokens, content, "");
    return res.status(200).send({
      status: "OK",
      message: "Updated Order Successfully",
      content: resOrder,
    });
  } catch (err) {
    return res.status(400).send({
      status: "ERR_SERVER",
      message: err.message,
      content: null,
    });
  }
};

module.exports = {
  order_get,
  order_post,
  order_update,
};
