const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const favoriteListSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    items: [
      {
        _id: false,
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'product',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const FavoriteList = mongoose.model('FavoriteList', favoriteListSchema);

module.exports = FavoriteList;
