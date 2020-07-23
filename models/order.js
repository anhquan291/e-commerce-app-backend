const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const orderItem = require('./item');

const orderSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    items: [orderItem],
    totalAmount: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    status: {
      type: String, //waiting, confirmed, deliver, success
      default: 'waiting',
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
