/* eslint-disable consistent-return */
const Cart = require("../models/cart");

const cart_get = (req, res) => {
  Cart.find()
    .populate("items.item") //access to items ref from product
    .then((data) => {
      return res.status(200).send({
        status: "OK",
        message: "Get Users Carts Successfully",
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

const cart_post = (req, res) => {
  if (!req.body) {
    return res.status(200).send({
      status: "ERR_REQUEST",
      message: "Please check your request!",
      content: null,
    });
  }
  Cart.findOne({ userId: req.body.userId }, (err, result) => {
    if (err) {
      return res.status(404).send({
        status: "ERR_SERVER",
        message: err.message,
        content: null,
      });
    }
    if (result) {
      const item = req.body.items[0].item;
      const cartIndex = result.items.findIndex((cart) => {
        return cart.item.toString() === item;
      });
      if (cartIndex < 0) {
        result.items.push(req.body.items[0]);
        result
          .save()
          .then((data) => {
            return res.status(200).send({
              status: "OK",
              message: "Added Cart Successfully",
              content: data,
            });
          })
          .catch((err) => console.log(err));
      } else {
        result.items[cartIndex].quantity = (
          Number(result.items[cartIndex].quantity) + 1
        ).toString();
        result
          .save()
          .then((data) => {
            return res.status(200).send({
              status: "OK",
              message: "Added Cart Successfully",
              content: data,
            });
          })
          .catch((err) => console.log(err));
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
            status: "OK",
            message: "Added Cart Successfully",
            content: data,
          });
        })
        .catch((err) => console.log(err));
    }
  }).catch((err) => {
    return res.status(400).send({
      status: "ERR_SERVER",
      message: err.message,
      content: null,
    });
  });
};
const cart_update = (req, res) => {
  const id = req.params.id;
  const { item, quantity } = req.body;
  if (!req.body || !id) {
    return res.status(200).send({
      status: "ERR_REQUEST",
      message: "Please check your request",
      content: null,
    });
  }
  Cart.findById(id, (err, result) => {
    if (err) {
      console.log(err);
    }
    const cartIndex = result.items.findIndex((cart) => {
      return cart.item.toString() === item;
    });
    if (quantity === "increase") {
      result.items[cartIndex].quantity = (
        Number(result.items[cartIndex].quantity) + 1
      ).toString();
      result.save();
    } else if (Number(result.items[cartIndex].quantity) === 1) {
      result.items.splice(cartIndex, 1);
      result.save();
    } else {
      result.items[cartIndex].quantity = (
        Number(result.items[cartIndex].quantity) - 1
      ).toString();
      result.save();
    }
  })
    .then((data) => {
      return res.status(200).send({
        status: "OK",
        message: "Updated Cart Successfully",
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
const cart_deleteCartItem = (req, res) => {
  const { id } = req.params;
  const { item } = req.body;
  if (!req.body || !req.params.id) {
    return res.status(200).send({
      status: "ERR_REQUEST",
      message: "Please check your ID request",
      content: null,
    });
  }
  Cart.findById(id, (err, result) => {
    if (err) {
      console.log(err);
    }
    const cartIndex = result.items.findIndex((cart) => {
      return cart.item.toString() === item;
    });
    result.items.splice(cartIndex, 1);
    result.save();
  })
    .then((data) => {
      return res.status(200).send({
        status: "OK",
        message: "Delete Cart Item Successfully",
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

const cart_delete = (req, res) => {
  const id = req.params.id;
  Cart.findByIdAndDelete(id)
    .then((data) => {
      return res.status(200).send({
        status: "OK",
        message: "Delete Cart Successfully",
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
  cart_get,
  cart_post,
  cart_update,
  cart_deleteCartItem,
  cart_delete,
};
