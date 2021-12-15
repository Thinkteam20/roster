const mongoose = require("mongoose");

let cuscSchema = new mongoose.Schema({
  title: String,
  id: String,
  site: String,
  roles: String,
  location: String,
  groupId: String,
});

module.exports = mongoose.model("cusc", cuscSchema);
