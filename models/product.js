const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    filename: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    origin: {
      type: String,
      required: true,
    },
    standard: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      default: '',
    },
    thumb: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const Product = mongoose.model('product', productSchema);

module.exports = Product;
