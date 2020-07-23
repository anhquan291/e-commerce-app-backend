const Cart = require('../models/cart');
const Product = require('../models/product');

const cart_get = (req, res) => {
  Cart.find()
    .populate('items.item') //access to items ref from product
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

const cart_post = async (req, res) => {
  if (!req.body) {
    return res.status(200).send({
      status: 'ERR_REQUEST',
      message: 'Please check your request!',
      content: null,
    });
  }

  Cart.findOne({ userId: req.body.userId }, (err, result) => {
    if (result) {
      // res.send('Co ton tai');
      const reqCartId = req.body.items[0].item;
      console.log(reqCartId);
      let cartIndex;
      result.items.map((item, index) => {
        if (item.item == reqCartId) {
          return (cartIndex = index);
        } else {
          return;
        }
      });
      console.log(cartIndex);
      if (isNaN(cartIndex)) {
        result.items.push(req.body.items[0]);
        result
          .save()
          .then((data) => {
            return res.status(200).send({
              status: 'OK',
              message: 'Added Cart Successfully',
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
      } else {
        result.items[cartIndex].quantity = (
          +result.items[cartIndex].quantity + 1
        ).toString();
        result
          .save()
          .then((data) => {
            return res.status(200).send({
              status: 'OK',
              message: 'Updated Quantity Successfully',
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
      }
    } else {
      const cart = new Cart({
        userId: req.body.userId,
        items: req.body.items[0],
      });
      cart
        .save()
        .then((data) => {
          return res.status(200).send({
            status: 'OK',
            message: 'Added Cart Successfully',
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
    }
  });
};
const cart_update = (req, res) => {
  const id = req.params.id;
  if (!req.params.id) {
    return res.status(200).send({
      status: 'ERR_REQUEST',
      message: 'Please check your ID request',
      content: null,
    });
  }
  Cart.findByIdAndUpdate(id)
    .then((data) => {
      return res.status(200).send({
        status: 'OK',
        message: 'Updated Orders Successfully',
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
const cart_delete = (req, res) => {
  const id = req.params.id;
  if (!req.params.id) {
    return res.status(200).send({
      status: 'ERR_REQUEST',
      message: 'Please check your ID request',
      content: null,
    });
  }
  Cart.findByIdAndDelete(id)
    .then((data) => {
      return res.status(200).send({
        status: 'OK',
        message: 'Deleted Orders Successfully',
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
  cart_get,
  cart_post,
  cart_update,
  cart_delete,
};
