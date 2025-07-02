const mongoose = require("mongoose");

const logEntrySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    comments: {
      type: String,
    },
    rating: {
      type: Number,
      min: 0,
      max: 10,
      default: 5,
    },
    image: {
      type: String,
    },
    latitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90,
    },
    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180,
    },
    visitDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const LogEntry = mongoose.model("LogEntry", logEntrySchema);

module.exports = LogEntry;
