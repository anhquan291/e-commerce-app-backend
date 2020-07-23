const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const productController = require('../controllers/controller.product');

router.get('/', productController.product_get);

//post
router.post('/post', upload.single('imageUrl'), productController.product_post);

//update
router.put('/:id', productController.product_update);

//delete
router.delete('/:id', productController.product_delete);

module.exports = router;
