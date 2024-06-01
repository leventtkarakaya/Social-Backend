const express = require("express");
const { protect } = require("../Middleware/AuthMiddleware");
const {
  getUsers,
  getAllUsers,
  followUser,
  deleteUser,
  updatedUser,
} = require("../Controllers/UserController");

const router = express.Router();

router.get("/", protect, getUsers);
router.get("/all", getAllUsers);
router.get("/follow/:userId", protect, followUser);
router.put("/update/:id", protect, updatedUser);
router.delete("/delete/:id", protect, deleteUser);

module.exports = router;
