//const PasswordComplexity = require("joi-password-complexity");
const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");
const config = require("config");
const Schema = mongoose.Schema;

const messageSchema = new mongoose.Schema({
  new: { type: Boolean, default: true },
  created_on: { type: Date, default: Date.now },
  to: { type: Schema.Types.ObjectId, ref: "User" },
  from: { type: Schema.Types.ObjectId, ref: "User" },
  messageText: String,
  read: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  last: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  },
  level: {
    type: String,
    minlength: 4,
    maxlength: 50
  },
  email: {
    type: String,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    minlength: 5,
    maxlength: 1024
  },
  social: {},
  phone: {
    type: String,
    minlength: 7,
    maxlength: 14
  },
  isAdmin: { type: Boolean, default: false },
  created_on: { type: Date, default: Date.now },
  updated_on: { type: Date, default: Date.now },
  apikeys: [{ type: Schema.Types.ObjectId, ref: "Apikey" }],
  messages: [messageSchema],
  sentMessages: [{ type: Schema.Types.ObjectId, ref: "messages" }],
  status: { type: String, default: "Active" },
  isVerified: { type: Boolean, default: false },
  passwordResetToken: String,
  passwordResetExpires: Date
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      last: this.last,
      email: this.email,
      level: this.level,
      isAdmin: this.isAdmin
    },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("Users", userSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string()
      .min(3)
      .max(50)
      .required(),
    last: Joi.string()
      .min(2)
      .max(50),
    level: Joi.string()
      .min(4)
      .max(50),
    status: Joi.string()
      .min(3)
      .max(15),
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .min(5)
      .max(255)
      .required(),
    isAdmin: Joi.boolean()
  };
  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;
