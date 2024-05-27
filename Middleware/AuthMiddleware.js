const jwt = require("jsonwebtoken");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config(path.join(__dirname, "../.env"));

const JWT_SECRET = process.env.JWT_SECRET;

const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    console.log("🚀 ~ protect ~ token:", token);
    if (!token) {
      return res
        .status(401)
        .json({ message: "Giriş yapmanız gerekmektedir.", success: false });
    }
    const Token = token.split(" ")[1];
    const decoded = jwt.verify(Token, JWT_SECRET);
    if (decoded) {
      req.body.userId = decoded;
      return next();
    } else {
      res
        .status(401)
        .json({ message: "Giriş yapmanız gerekmektedir.", success: false });
    }
  } catch (error) {
    console.log("🚀 ~ protect ~ error:", error);
    res
      .status(401)
      .json({ message: "Giriş yapmanız gerekmektedir.", success: false });
  }
};

module.exports = { protect };
