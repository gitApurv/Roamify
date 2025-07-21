const { Router } = require("express");
const router = Router();

const verifyToken = require("./verify");
const LogEntry = require("../models/logEntry");

router.get("/get-logs", verifyToken, async (req, res, next) => {
  try {
    const id = req.user.id;
    const entries = await LogEntry.find({ user: id });
    res.json(entries);
  } catch (error) {
    next(error);
  }
});

router.post("/create-log", verifyToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const log = req.body;
    log.user = userId;
    await LogEntry.create(log);
    res.json({ message: "Log Entry created successfully" });
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(422);
    }
    next(error);
  }
});

router.post("/edit-log/:logId", verifyToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const logData = req.body;
    const logId = req.params.logId;
    const log = await LogEntry.findById(logId);
    logData.user = userId;
    logData.image = logData.image || log.image;
    await LogEntry.findByIdAndUpdate(logId, logData);
    res.json({ message: "Log Entry edited successfully" });
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(422);
    }
    next(error);
  }
});

router.get("/delete-log/:logId", verifyToken, async (req, res, next) => {
  try {
    const logId = req.params.logId;
    await LogEntry.findByIdAndDelete(logId);
    res.json({ message: "Log Entry deleted successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
