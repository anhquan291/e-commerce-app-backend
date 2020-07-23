const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const favoriteItem = require('./favoriteItem');
const favoriteListSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    items: [favoriteItem],
  },
  {
    timestamps: true,
  }
);

const FavoriteList = mongoose.model('FavoriteList', favoriteListSchema);

module.exports = FavoriteList;
