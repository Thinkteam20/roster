const mongoose = require("mongoose");

const eventSchema2 = new mongoose.Schema({
  weekday: String,
  resourceId: String,
  title: String,
  start: String,
  end: String,
  backgroundColor: String,
  recronizedId: String,
  id: { type: String },
  name: { type: String },
  role: { type: String },
  description: { type: String },
  start: { type: String },
  end: { type: String },
  site: { type: String },
  wage: { type: Number },
  email: { type: String },
});

module.exports = mongoose.model("event2", eventSchema2);
