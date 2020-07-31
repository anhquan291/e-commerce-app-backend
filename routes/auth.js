const express = require('express');
const router = express.Router();
const {
  user_register,
  user_login,
  user_resetpw,
  user_receivepw,
} = require('../controllers/controller.user');

router.post('/register', user_register);
router.post('/login', user_login);
router.post('/reset_pw', user_resetpw);
router.post('/receive_new_password/:userId/:token', user_receivepw);

module.exports = router;
