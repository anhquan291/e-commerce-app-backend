const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
  _id: false,
  filename: {
    type: String,
    required: true,
  },
  quantity: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  sum: {
    type: String,
    required: true,
  },
});

module.exports = itemSchema;
