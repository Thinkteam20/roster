const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  resourceId: String,
  title: String,
  start: String,
  end: String,
  backgroundColor: String,
  recronizedId: "",
});

module.exports = mongoose.model("event", eventSchema);
