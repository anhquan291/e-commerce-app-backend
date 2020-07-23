const express = require('express');
const router = express.Router();
const orderController = require('../controllers/controller.order');

router.get('/', orderController.order_get);
router.post('/post', orderController.order_post);
router.put('/:id', orderController.order_update);

module.exports = router;
