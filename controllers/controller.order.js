const Order = require('../models/order');

const order_get = (req, res) => {
  Order.find()
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
  const order = new Order(req.body);
  order
    .save()
    .then((data) => {
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
  const id = req.params.id;
  if (!req.params.id) {
    return res.status(200).send({
      status: 'ERR_REQUEST',
      message: 'Please check your ID request',
      content: null,
    });
  }
  Order.findByIdAndUpdate(id, req.body.status)
    .then((data) => {
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
