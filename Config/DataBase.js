const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config(path.join(__dirname, "../.env"));

const MONGO_URI = process.env.MONGO_URI;
const DataBase = () => {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log("Database Connected Successfully");
    })
    .catch((err) => {
      console.log({
        error: err.message,
      });
    });
};

module.exports = DataBase;
