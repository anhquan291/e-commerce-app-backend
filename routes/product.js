const express = require("express");
const router = express.Router();
const { upload, resize } = require("../middlewares/upload");
const productController = require("../controllers/controller.product");

router.get("/", productController.product_get);

//post
router.post(
  "/post",
  upload.single("imageUrl"),
  resize,
  productController.product_post
);

//update
router.patch(
  "/:id",
  upload.single("imageUrl"),
  resize,
  productController.product_update
);

//delete
router.delete("/:id", productController.product_delete);

module.exports = router;
