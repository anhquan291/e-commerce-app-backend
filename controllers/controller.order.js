const Order = require("../models/order");
const User = require("../models/user");
const pushNotification = require("../middlewares/pushNotification");
const stripe = require("stripe")(
  "sk_test_51HLo2AD28q5Rme0eyvB61M8IIVyUupPuuYc172JyEJv0BloZ6wdkxb0aAoXfRlyb2CpU3loLoJaHOCEKSnmNdhzn00hHUzdJ6f"
);
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
const order_post = (req, res) => {
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

  if (Object.keys(token).length != 0) {
    stripe.charges
      .create({
        amount: totalAmount,
        currency: "usd",
        description: `Order Items: ${orders}`,
        source: token.id,
      })
      .then((result) => {
        console.log("charged customer credit card!");
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).send({
          status: "ERR_SERVER",
          message: err.message,
          content: null,
        });
      });

    order
      .save()
      .then((data) => {
        User.findById(data.userId).then((user) => {
          pushNotification(user.pushTokens, content, "");
          transporter.sendMail(
            sendUserOrderTemplate(data, user),
            (err, info) => {
              if (err) {
                console.log(err);
              }
              console.log(`** Email sent **`, info);
            }
          );
        });
        return res.status(200).send({
          status: "OK",
          message: "Added Order Successfully",
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
  } else {
    order
      .save()
      .then((data) => {
        User.findById(data.userId).then((user) => {
          pushNotification(user.pushTokens, content, "");
          transporter.sendMail(
            sendUserOrderTemplate(data, user),
            (err, info) => {
              if (err) {
                console.log(err);
              }
              console.log(`** Email sent **`, info);
            }
          );
        });
        return res.status(200).send({
          status: "OK",
          message: "Added Order Successfully",
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
  }
};
const order_update = (req, res) => {
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
  Order.findByIdAndUpdate(id, { status: updateStatus })
    .then((data) => {
      User.findById(data.userId).then((user) => {
        pushNotification(user.pushTokens, content, "");
      });
      return res.status(200).send({
        status: "OK",
        message: "Updated Order Successfully",
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

module.exports = {
  order_get,
  order_post,
  order_update,
};
