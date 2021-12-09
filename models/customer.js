const mongoose = require("mongoose");

let cusSchema = new mongoose.Schema({
  site: String,
  roles: String,
  location: String,
  id: String,
  event: [],
  employee: [],
});

module.exports = mongoose.model("cusb", cusSchema);
