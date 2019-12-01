const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const activitySchema = new mongoose.Schema({
  created_on: { type: Date, default: Date.now },
  user: { type: Schema.Types.ObjectId, ref: "users" },
  activity: { type: String },
  icon: { type: String, default: "&#xE065;" }
});

const contactSchema = new mongoose.Schema({
  created_on: { type: Date, default: Date.now },
  user: { type: Schema.Types.ObjectId, ref: "users" },
  name: { type: String },
  email: { type: String },
  phone: { type: String },
  message: { type: String }
});

const Activity = mongoose.model("activity", activitySchema);
const Contact = mongoose.model("contact", contactSchema);

exports.Activity = Activity;
exports.Contact = Contact;
