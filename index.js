const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const DataBase = require("./Config/DataBase");
const rateLimit = require("./Utils/RateLimit");
const path = require("path");
const multer = require("multer");
const options = multer({
  limits: {
    fieldSize: 1024 * 1024 * 20,
  },
  fileFilter: (req, res, cb) => {
    return cb(null, true);
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

dotenv.config(path.join(__dirname, "../.env"));

const app = express();
// Middlewares
app.use(cors());
app.use(express.json({ extends: true, limit: "30mb" }));
app.use(express.urlencoded({ extended: true, limit: "30mb" }));
app.use(rateLimit);
app.use(helmet());
app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin",
  })
);
app.use(morgan("common"));

app.post("/upload", options.single("avatar"), (req, res, next) => {
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

// Routes
const AuthRouter = require("./Router/AuthRouter");
const UserRouter = require("./Router/UserRouter");

app.use("/api/auth", AuthRouter);
app.use("/api/user", UserRouter);

// DataBase Connection
DataBase();
// Server Setup
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
