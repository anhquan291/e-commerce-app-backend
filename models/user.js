const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const registerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    lowercase: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    // enum: 10,
    default: '',
  },
  address: {
    type: String,
    // minlength: 6,
    default: '',
  },
  profilePicture: {
    type: String,
  },
  pushTokens: {
    type: Array,
    required: true,
  },
});

const Register = mongoose.model('user', registerSchema);
module.exports = Register;
