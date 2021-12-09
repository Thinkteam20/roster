const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  resourceId: String,
  title: String,
  start: String,
  end: String,
  backgroundColor: String,
});

module.exports = mongoose.model("event", eventSchema);
