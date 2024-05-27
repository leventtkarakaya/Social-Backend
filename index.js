const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const DataBase = require("./Config/DataBase");
const rateLimit = require("./Utils/RateLimit");
const path = require("path");

dotenv.config(path.join(__dirname, "../.env"));

const app = express();
// Middlewares
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

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

// Routes
const AuthRouter = require("./Router/AuthRouter");

app.use("/api/auth", AuthRouter);

// DataBase Connection
DataBase();

// Server Setup
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
