const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMS: 15 * 60 * 1000, // 15 minutes
  standardHeaders: true,
  limit: async (req, res) => {
    if (await req.user) {
      return 100;
    } else {
      return 10;
    }
  },
  headers: true,
  handler: (req, res) => {
    res.status(429).json({ message: "Çok fazla istek yapıldı" });
  },
});

module.exports = limiter;
