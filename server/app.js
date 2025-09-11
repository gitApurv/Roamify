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
const path = require("path");
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

app.set("view engine", "ejs");
app.set("views", path.join(__dirname + "/views"));

app.get("/", async (req, res) => {
  res.render("index", {
    app: "Roamify API 🚀",
    description:
      "👉 A project that turns personal journeys into an interactive, visual storytelling experience.",
    author: {
      name: "Apurv Maurya",
      github: "https://github.com/gitApurv",
      portfolio: "https://my-portfolio-eight-theta-70.vercel.app/",
      linkedin: "https://www.linkedin.com/in/apurvmaurya",
    },
    version: "1.0.0",
    status: "✅ Running",
  });
});

app.use("/api", authRouter);
app.use("/api", logsRouter);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

app.listen(process.env.PORT, () => {
  console.log("Server is running on port", process.env.PORT);
});
