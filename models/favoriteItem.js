const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favoriteItemSchema = new Schema({
  filename: {
    type: String,
    required: true,
  },
});

module.exports = favoriteItemSchema;
