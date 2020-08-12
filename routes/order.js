const express = require('express');
const router = express.Router();
const orderController = require('../controllers/controller.order');
const verifyToken = require('../middlewares/verifytoken');

router.get('/', verifyToken, orderController.order_get);
router.post('/post', verifyToken, orderController.order_post);
router.patch('/:id', verifyToken, orderController.order_update);

module.exports = router;
