const mongoose = require("mongoose");

let cusSchema = new mongoose.Schema({
  title: String,
  id: String,
  site: String,
  roles: String,
  location: String,
});

module.exports = mongoose.model("cusb", cusSchema);
