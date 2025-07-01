const express = require("express");
const dotenv = require("dotenv").config();
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");

const middlewares = require("./middlewares");

const app = express();

app.use(morgan("common"));
app.use(helmet());
app.use(cors());

app.get("/", (req, res, next) => {
  res.json({
    message: "Hello World!",
  });
});

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

app.listen(process.env.PORT, () => {
  console.log("Server is running on port", process.env.PORT);
});
