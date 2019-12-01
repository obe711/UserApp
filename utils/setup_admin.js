"use strict";
require("dotenv").config();
const inquirer = require("inquirer");
const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const { User } = require("../models/User");
const _ = require("lodash");
const bcrypt = require("bcrypt");

if (process.env.NODE_ENV === "production") {
  mongoose
    .connect(`mongodb://localhost/${process.env.DB_NAME}?replicaSet=rs`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .catch(err => console.error("Could not connect...", err));

  mongoose.set("useCreateIndex", true);
} else {
  mongoose
    .connect(`mongodb://localhost:27017/${process.env.DB_NAME}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .catch(err => console.error("Could not connect...", err));

  mongoose.set("useCreateIndex", true);
}

function validateInput(req) {
  const schema = {
    email: Joi.string()
      .min(5)
      .max(255)
      .email(),
    password: Joi.string()
      .min(5)
      .max(255),
    repeat_password: Joi.ref("password")
  };
  return Joi.validate(req, schema);
}

console.log("MERN Stack Admin User Setup...", process.env.DB_NAME);

var questions = [
  {
    type: "input",
    name: "name",
    message: "What's your first name",
    default: function() {
      return "Web";
    }
  },
  {
    type: "input",
    name: "last",
    message: "What's your last name",
    default: function() {
      return "Admin";
    }
  },
  {
    type: "input",
    name: "email",
    message: "What's your email?",
    validate: async function(value) {
      try {
        await validateInput({ email: value });
        return true;
      } catch (ex) {
        return "Please enter a valid email";
      }
    }
  },
  {
    type: "input",
    name: "password",
    message: "Password?",
    validate: async function(value) {
      try {
        await validateInput({ password: value });
        return true;
      } catch (ex) {
        return "Password too short";
      }
    }
  }
];

inquirer.prompt(questions).then(async answers => {
  console.log(JSON.stringify(answers, null, "  "));
  answers.level = "Admin";
  let user = await User.findOne({ email: answers.email });
  if (user) {
    //ReSave
    console.log("Email exists... Saving new password");
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(answers.password, salt);
    user.isAdmin = true;
    user.isVerified = true;
    await user.save(function(err) {
      if (err) {
        console.log("err");
        mongoose.connection.close();
      } else {
        console.log("Admin Saved!");
        mongoose.connection.close();
      }
    });
  } else {
    //Create New
    user = new User(
      _.pick(answers, ["name", "last", "email", "password", "level"])
    );
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    user.isAdmin = true;
    user.isVerified = true;
    await user.save(function(err) {
      if (err) {
        console.log("err");
        mongoose.connection.close();
      } else {
        console.log("Admin Saved!");
        mongoose.connection.close();
      }
    });
  }
});

/** 
(async function() {
  try {
    const value = await validateEmail({
      password: "t5blespoon",
      repeat_password: "t5blespoon"
    });
    console.log("true");
  } catch (err) {
    console.log(err);
    mongoose.connection.close();
  }
})();
*/
