const sharp = require('sharp');
const os = require('os');
const Product = require('../models/product');

const product_get = (req, res) => {
  let page = parseInt(req.query.page) || 0; //for next page pass 1 here
  let limit = parseInt(req.query.limit) || 0;
  Product.find()
    .sort({ update_at: -1 })
    .skip(page * limit) //Notice here
    .limit(limit)
    .exec((err, data) => {
      if (err) {
        return res.status(400).send({
          status: 'ERR_SERVER',
          message: err.message,
          content: null,
        });
      }
      Product.countDocuments().exec((count_error, count) => {
        if (err) {
          return res.json(count_error);
        }
        return res.json({
          total: count,
          page: page,
          pageSize: data.length,
          content: data,
        });
      });
    });
};

const product_post = (req, res) => {
  const host = process.env.HOST_NAME;
  if (!req.body && !req.file) {
    return res.status(200).send({
      status: 'ERR_REQUEST',
      message: 'Please check your request!',
      content: null,
    });
  } else {
    const imageUrl = host + '/public/api/static/images/' + req.file.filename;
    sharp(req.file.path)
      .resize(256, 144)
      .toFile(
        './public/api/static/images/' + '256x144-' + req.file.filename,
        (err) => {
          if (err) {
            console.error('sharp>>>', err);
          }
          console.log('resize successfully');
        }
      );
    const resizeUrl =
      host + '/public/api/static/images/' + '256x144-' + req.file.filename;
    const product = new Product({
      filename: req.body.filename,
      price: req.body.price,
      color: req.body.color,
      origin: req.body.origin,
      standard: req.body.standard,
      description: req.body.description,
      url: imageUrl,
      thumb: resizeUrl,
      type: req.body.type,
    });
    product
      .save()
      .then((data) => {
        return res.status(200).send({
          status: 'OK',
          message: 'Added Product Successfully',
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
};

const product_update = (req, res) => {
  const id = req.params.id;
  if (!req.params.id) {
    return res.status(200).send({
      status: 'ERR_REQUEST',
      message: 'Please check your ID request',
      content: null,
    });
  }
  Product.findByIdAndUpdate(id, req.body)
    .then((data) => {
      return res.status(200).send({
        status: 'OK',
        message: 'Updated Product Successfully',
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

const product_delete = (req, res) => {
  const id = req.params.id;
  Product.findByIdAndDelete(id)
    .then((data) => {
      return res.status(200).send({
        status: 'OK',
        message: 'Deleted Product Successfully',
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
  product_get,
  product_post,
  product_update,
  product_delete,
};
