const express = require("express");
const { protect } = require("../Middleware/AuthMiddleware");
const MulterMiddleware = require("../Middleware/MulterMiddleware");
const {
  publishPost,
  getAllPosts,
  contentActionHandler,
  getPopularPost,
} = require("../Controllers/PostController");

const router = express.Router();

router.get("/", protect, getAllPosts);
router.get("/popular", protect, getPopularPost);
router.post("/publish", protect, MulterMiddleware, publishPost);
router.post("/action", protect, contentActionHandler);

module.exports = router;
