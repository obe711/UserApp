const config = require("config");
const dotenv = require("dotenv");
const moment = require("moment");
const _ = require("lodash");
const { User, validate, Request } = require("../models/User");
const { Token } = require("../models/Token");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { Activity } = require("../schema/activity");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const axios = require("axios");

//User Activity
router.get("/activity", auth, async (req, res) => {
  const list = await Activity.find({})
    .limit(5)
    .sort({ _id: -1 })
    .populate("users");

  //console.log(list);
  res.json(list);
});

//Send Message
router.post("/send/id/:id", auth, async (req, res) => {
  const { id } = req.params;
  const { messageText } = req.body;
  const to = await User.findById(id);
  const from = await User.findById(req.user._id);

  const message = { messageText, from: req.user._id, to: id };

  to.messages.push(message);

  const sent = await to.save();

  const sentID = to.messages[0]["_id"];

  from.sentMessages.push(sentID);

  const response = await from.save();

  new Activity({
    user: from._id,
    activity: "Sent Message",
    icon: "mail"
  }).save();

  res.send("Message Sent");
});

//Admin View & Edit User
router.get("/id/:id", auth, admin, async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id).select({
    name: 1,
    last: 1,
    email: 1,
    level: 1,
    status: 1,
    created_on: 1
  });
  res.json(user);
});

//Admin WebHook
router.get("/webhooks/SomeHook", auth, admin, async (req, res) => {
  axios.get("http://localhost:5000/webhooks/someHook");
  res.send("loading");
});

router.put("/id/:id", auth, admin, async (req, res) => {
  const id = req.params.id;
  const user = req.body.user;
  user.updated_on = moment();
  try {
    await User.findByIdAndUpdate(id, user, { useFindAndModify: false });
    res.status(200);
  } catch (ex) {
    return res.status(400).send("Error");
  }
});

//User List
router.get("/userlist", auth, admin, async (req, res) => {
  const userlist = await User.find({}).select({
    name: 1,
    last: 1,
    email: 1,
    level: 1,
    status: 1,
    created_on: 1
  });
  res.json(userlist);
});

//User Profile - View & Edit User
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select({
    password: 0
  });
  res.send(user);
});

router.put("/me", auth, async (req, res) => {
  const { updateUser } = req.body;
  const user = await User.findByIdAndUpdate(req.user._id, updateUser);
  new Activity({
    user: req.user._id,
    activity: "Updated Profile",
    icon: "&#xE065;"
  }).save();
  //console.log("updated user");
  res.send("Your profile has been successfully updated!");
});

//CREATE NEW USER
router.post("/", async (req, res) => {
  const { error } = validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");
  if (req.body.isAdmin) return res.status(400).send("Invalid Request");

  //Create Admin
  if (req.body.level === "Admin") {
    req.body.isAdmin = true;
  } else {
    req.body.isAdmin = false;
  }

  user = new User(
    _.pick(req.body, ["name", "last", "email", "password", "level", "status"])
  );
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save(function(err) {
    if (err) {
      return res.status(500).send(err.message);
    }

    // Create a verification token for this user
    var token = new Token({
      _userId: user._id,
      token: crypto.randomBytes(16).toString("hex")
    });

    // Save the verification token
    token.save(function(err) {
      if (err) {
        return res.status(500).send(err.message);
      }

      // Send the email
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_GMAIL_USERNAME,
          pass: process.env.EMAIL_GMAIL_PASSWORD
        }
      });

      const mailOptions = {
        from: process.env.EMAIL_GMAIL_USERNAME,
        to: user.email,
        subject: "Account Verification",
        text:
          "Hello,\n\n" +
          "Please verify your account by clicking the link then set a new password: \nhttp://" +
          req.headers.host +
          "/" +
          user._id +
          "/cx/" +
          token.token +
          "\n"
      };
      transporter.sendMail(mailOptions, function(err) {
        if (err) {
          return res.status(500).send(err.message);
        }

        const headertoken = user.generateAuthToken();

        res
          .header("x-auth-token", headertoken)
          .header("access-control-expose-headers", "x-auth-token")
          .send("A verification email has been sent to " + user.email + ".");
      });
    });
  });
});

module.exports = router;
