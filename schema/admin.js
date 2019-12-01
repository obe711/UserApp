const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const loginSchema = new mongoose.Schema({
    service: String,
    username: String,
    password: String,
})

const Logins = mongoose.model("Logins", loginSchema, "Logins");

exports.Logins = Logins;