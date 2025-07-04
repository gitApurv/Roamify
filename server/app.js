const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const middlewares = require("./middlewares");
const logsRouter = require("./api/logs");
const authRouter = require("./api/auth");

const app = express();

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI);

app.use(morgan("common"));
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api", authRouter);
app.use("/api", logsRouter);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

app.listen(process.env.PORT, () => {
  console.log("Server is running on port", process.env.PORT);
});
