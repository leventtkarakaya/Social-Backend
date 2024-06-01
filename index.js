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

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/Views/index.html"));
});

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
const UserRouter = require("./Router/UserRouter");
app.use("/api/auth", AuthRouter);
app.use("/api/user", UserRouter);

// DataBase Connection
DataBase();

// Server Setup
const PORT = "http://localhost:9080" || process.env.PORT;

app.listen(9080, () => {
  console.log(`Server is running on port ${"http://localhost:9080"}`);
});
