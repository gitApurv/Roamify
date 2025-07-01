const { Router } = require("express");
const router = Router();

const LogEntry = require("../models/LogEntry");

router.get("/", (req, res, next) => {
  res.json({
    message: "🌍",
  });
});

router.post("/", async (req, res, next) => {
  try {
    const logEntry = new LogEntry(req.body);
    const createdLogEntry = await logEntry.save();
    res.json(createdLogEntry);
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(422);
    }
    next(error);
  }
});

module.exports = router;
