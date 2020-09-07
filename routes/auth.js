const express = require("express");
const router = express.Router();
const {
  user_register,
  user_login,
  user_resetpw,
  user_receivepw,
  user_edit,
  user_photoUpload,
} = require("../controllers/controller.user");
const verifyToken = require("../middlewares/verifytoken");
const upload = require("../middlewares/uploadProfilePic");

router.post("/register", user_register);
router.post("/login", user_login);
router.patch("/:id", verifyToken, user_edit);
router.post("/reset_pw", user_resetpw);
router.post("/receive_new_password/:userId/:token", user_receivepw);
router.patch(
  "/photo/:id",
  verifyToken,
  upload.single("profilePic"),
  user_photoUpload
);

module.exports = router;
