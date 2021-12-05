const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String },
  role: { type: String },
  description: { type: String },
  time: { type: String },
  wage: { type: Number },
  quantity: { type: Number },
  rating: { type: Number },
  inventoryStatus: { type: String },
  image: { type: String },
});

module.exports = mongoose.model("Log", LogSchema);
