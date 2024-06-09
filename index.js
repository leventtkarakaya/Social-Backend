const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const DataBase = require("./Config/DataBase");
const rateLimit = require("./Utils/RateLimit");
const path = require("path");
const multer = require("multer");

dotenv.config({ path: "/.env" }); // Environment değişkenleri ayarlanır.

const app = express();

// Multer yapılandırması
const upload = multer({
  limits: {
    fieldSize: 1024 * 1024 * 20, // 20MB dosya boyutu sınırı
  },
  fileFilter: (req, file, cb) => {
    // Dosya filtresi (isteğe bağlı)
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new Error("Lütfen JPEG veya PNG formatında bir dosya yükleyin."));
    }
  },
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname); // Dosya ismini korur.
    },
  }),
});

// Middleware'ler
app.use(cors());
app.use(express.json({ extended: true, limit: "30mb" }));
app.use(express.urlencoded({ extended: true, limit: "30mb" }));
app.use(rateLimit);
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common")); // Günlükleri kaydetmek için morgan kullanılır.

// Dosya Yükleme
app.post("/register/image-upload", upload.single("image"), (req, res, next) => {
  const imageFile = req.file;
  if (imageFile) {
    res.status(200).json({
      success: true,
      message: "Dosya başarıyla yüklenendi",
      file: imageFile, // Dosya bilgileri gönderilir.
    });
  } else {
    res.status(400).json({
      success: false,
      message:
        "Dosya yüklenirken hata oluştu. Lütfen geçerli bir dosya seçtiğinizden emin olun.",
    });
  }
});

// Dosya Gösterimi
app.get("/upload/:image", (req, res) => {
  const params = req.params.image; // 'image' parametresi kullanılır.
  res.sendFile(path.join(__dirname, "uploads", params));
});

// Rotalar
const AuthRouter = require("./Router/AuthRouter");
const UserRouter = require("./Router/UserRouter");

app.use("/api/auth", AuthRouter);
app.use("/api/user", UserRouter);

// Veritabanı Bağlantısı
DataBase();

// Sunucu Başlatma
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
