# electron

# roster

const mongoose = require("mongoose");

const cusSchema = new mongoose.Schema({
// column data
site: { type: String },
roles: { type: String },
location: { type: String },
id: { type: String },
resourceId: { type: String },
title: { type: String },
start: { type: String },
end: { type: String },
backgroundColor: { type: String },
