const expres = require("express");

const multer = require("multer");

const options = multer({
  limits: {
    fieldSize: 1024 * 1024 * 20,
  },
  fileFilter: (req, res, cb) => {
    if (
      req.file.mimetype == "image/png" ||
      req.file.mimetype == "image/jpg" ||
      req.file.mimetype == "image/jpeg"
    ) {
      return cb(null, true);
    } else {
      return cb(new Error("Dosya uzantısı PNG, JPG, JPEG olmalı"), false);
    }
  },
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
});

const app = expres();

app.post("/register", options.single("avatar"), (req, res, next) => {
  let imageFile = req.file;
  if (imageFile) {
    res.status(200).json({
      success: true,
      message: "Dosya başarıyla yüklenendi",
      file: imageFile,
    });
  } else {
    res.status(400).json({
      success: false,
      message: "Dosya yüklenirke hata oluştu",
    });
  }
  next();
});

app.get("/uploads/:image", (req, res) => {
  let params = req.params.file;
  res.sendFile(path.join(__dirname + "/uploads/" + params));
});

module.exports = app;
