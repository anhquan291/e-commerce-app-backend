const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const item = require('./item');

const cartSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  items: [
    {
      _id: false,
      item: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product',
      },
      quantity: {
        type: String,
        default: '1',
      },
    },
  ],
});
const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
