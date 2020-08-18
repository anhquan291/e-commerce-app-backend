const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifytoken');

const favoriteController = require('../controllers/controller.favorite');

router.get('/', verifyToken, favoriteController.favorite_get);

router.post('/post', verifyToken, favoriteController.favorite_post);

router.patch('/:userId', verifyToken, favoriteController.favorite_deleteItem);

module.exports = router;
