const multer = require("multer");
const path = require("path");

const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + String(Math.floor(Math.random() * 1000)) + path.extname(file.originalname));
  },
});

const imageUpload = multer({
  storage: imageStorage,
  fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const validMime = file.mimetype === "image/jpeg" || file.mimetype === "image/png";
    const validExt = ext === ".jpeg" || ext === ".jpg" || ext === ".png";

    if (!validMime || !validExt) {
      return cb(new Error("Por favor, envie apenas imagens nos formatos .jpeg ou .png!"));
    }
    cb(null, true);
  },
});

module.exports = { imageUpload };