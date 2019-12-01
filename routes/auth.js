const _ = require("lodash");
const { User } = require("../models/User");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Joi = require("@hapi/joi");
const auth = require("../middleware/auth");
const { Activity } = require("../schema/activity");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password.");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  new Activity({
    user: user._id,
    activity: `Logged In`,
    icon: "&#xE065;"
  }).save();

  const token = user.generateAuthToken();
  res.send(token);
});

router.put("/", auth, async (req, res) => {
  if (req.body.password !== req.body.repeatPassword)
    return res.status(400).send("Passwords do not match");

  const { error } = validatePassword({ password: req.body.password });
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findById(req.user._id);
  if (!user) return res.status(400).send("Not logged in");

  user.password = req.body.password;
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  res.send("Password has been changed");
});

function validatePassword(req) {
  const schema = {
    password: Joi.string()
      .min(5)
      .max(255)
      .required()
  };
  return Joi.validate(req, schema);
}

function validate(req) {
  const schema = {
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .min(5)
      .max(255)
      .required()
  };
  return Joi.validate(req, schema);
}

module.exports = router;
