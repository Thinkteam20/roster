const mongoose = require("mongoose");

const cusSchema = new mongoose.Schema({
  groupId: { type: String },
  title: { type: String },
  start: { type: String },
  end: { type: String },
  backgroundColor: { type: String },
});

module.exports = mongoose.model("cusb", cusSchema);
