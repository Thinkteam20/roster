const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String },
  role: { type: String },
  description: { type: String },
  start: { type: String },
  end: { type: String },
  site: { type: String },
  wage: { type: Number },
  quantity: { type: Number },
  inventoryStatus: { type: String },
});

module.exports = mongoose.model("Log", LogSchema);
