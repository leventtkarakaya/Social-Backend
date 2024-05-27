const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMS: 15 * 60 * 1000, // 15 minutes
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  limit: async (req, res) => {
    if (await req.user) {
      return 1000;
    } else {
      return 10;
    }
  },
  headers: true, // Return rate limit info in the `RateLimit-*` headers
  handler: (req, res) => {
    res.status(429).json({ message: "Too many requests" });
  },
});

module.exports = limiter;
