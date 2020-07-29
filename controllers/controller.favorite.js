const Favorite = require('../models/favorite');

const favorite_get = (req, res) => {
  Favorite.find()
    .populate('items') //access to items ref from product
    .then((data) => {
      return res.status(200).send({
        status: 'OK',
        message: 'Get Users Favorite List Successfully',
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

const favorite_post = (req, res) => {
  if (!req.body) {
    return res.status(200).send({
      status: 'ERR_REQUEST',
      message: 'Please check your request!',
      content: null,
    });
  }
  console.log(req.body.items[0].item);

  Favorite.findOne({ userId: req.body.userId }, (err, result) => {
    if (result) {
      result.items.push(req.body.items[0].item);
      result
        .save()
        .then((data) => {
          return res.status(200).send({
            status: 'OK',
            message: 'Added Favorite Item Successfully',
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
      const favorite = new Favorite({
        userId: req.body.userId,
        items: req.body.items[0].item,
      });
      favorite
        .save()
        .then((data) => {
          return res.status(200).send({
            status: 'OK',
            message: 'Added Favorite Item Successfully',
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

const favorite_deleteItem = (req, res) => {
  const id = req.params.id;
  const { item } = req.body;
  if (!req.body || !req.params.id) {
    return res.status(200).send({
      status: 'ERR_REQUEST',
      message: 'Please check your ID request',
      content: null,
    });
  }
  Favorite.findById(id, (err, result) => {
    const favoriteIndex = result.items.findIndex((product) => {
      return product.toString() === item;
    });
    result.items.splice(favoriteIndex, 1);
    result.save();
  })
    .then((data) => {
      return res.status(200).send({
        status: 'OK',
        message: 'Remove Favorite Item Successfully',
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
  favorite_get,
  favorite_post,
  favorite_deleteItem,
};
