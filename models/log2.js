const mongoose = require("mongoose");

const LogSchema2 = new mongoose.Schema({
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

module.exports = mongoose.model("Log2", LogSchema2);
