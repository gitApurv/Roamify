const { Router } = require("express");
const router = Router();

const verifyToken = require("./verify");
const LogEntry = require("../models/LogEntry");

router.get("/get-logs", verifyToken, async (req, res, next) => {
  try {
    const id = req.user.id;
    const entries = await LogEntry.find({ user: id });
    res.json(entries);
  } catch (error) {
    next(error);
  }
});

router.post("/create-logs", verifyToken, async (req, res, next) => {
  try {
    const id = req.user.id;
    const log = req.body;
    log.user = id;
    await LogEntry.create(log);
    res.json({ message: "Log Entry created successfully" });
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(422);
    }
    next(error);
  }
});

module.exports = router;
