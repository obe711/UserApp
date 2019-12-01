const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");
const config = require("config");
const Schema = mongoose.Schema;

const registrationSchema = new mongoose.Schema({
  email: {
    type: String,
    minlength: 5,
    maxlength: 255,
    unique: true
  }
});
