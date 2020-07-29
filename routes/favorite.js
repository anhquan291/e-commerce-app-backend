const express = require('express');
const router = express.Router();

const favoriteController = require('../controllers/controller.favorite');

router.get('/', favoriteController.favorite_get);

router.post('/post', favoriteController.favorite_post);

router.delete('/:id', favoriteController.favorite_deleteItem);

module.exports = router;
