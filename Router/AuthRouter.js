const express = require("express");

const { register, login } = require("../Controllers/AuthController");

const { protect } = require("../Middleware/AuthMiddleware");

const router = express.Router();

router.post("/register", protect, register);
router.post("/login", protect, login);

module.exports = router;
