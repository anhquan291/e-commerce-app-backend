const multer = require("multer");
const sharp = require("sharp");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/api/static/images/productPictures");
  },
  filename: function (req, file, cb) {
    cb(null, req.body.filename.replace(/ +/g, "") + ".jpg");
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Image uploaded is not of type jpg/jpeg  or png"), false);
  }
};
const resize = async (req, res, next) => {
  if (!req.file) return next();
  await sharp(req.file.path)
    .resize(256, 144)
    .toFile(
      "./public/api/static/images/productPictures/" +
        "256x144-" +
        req.body.filename.replace(/ +/g, "") +
        ".jpg",
      (err) => {
        if (err) {
          console.error("sharp>>>", err);
        }
        console.log("resize successfully");
      }
    );
  next();
};
const upload = multer({ storage, fileFilter });

module.exports = { upload, resize };
