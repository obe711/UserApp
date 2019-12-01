const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const { Token } = require("../models/Token");
const { User } = require("../models/User");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

router.get("/", (req, res) => {
  res.send("good");
});
//Password Reset
router.post("/xres", async (req, res) => {
  User.findOne({ email: req.body.email }, async function(err, user) {
    if (!user)
      return res
        .status(400)
        .send(
          "We were unable to find your account. Please contact our office."
        );
    user.isVerified = false;
    user.status = "New";
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
          host: process.env.EMAIL_HOST,
          port: 465,
          secure: true,
          auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
          }
        });
        const mailOptions = {
          from: process.env.EMAIL_NOREPLY,
          to: user.email,
          subject: "Account Verification - Password Reset",
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
});

//New User Registration
router.post("/register", async (req, res) => {
  // Find a matching token
  Token.findOne({ token: req.body.token }, function(err, token) {
    if (!token)
      return res
        .status(400)
        .send(
          "We were unable to find a valid token. Your token my have expired."
        );

    // If found a token, find a matching user
    User.findOne({ _id: token._userId, email: req.body.email }, async function(
      err,
      user
    ) {
      if (!user)
        return res
          .status(400)
          .send("We were unable to find a user for this token.");
      if (user.isVerified)
        return res.status(400).send("This user has already been verified.");

      // Verify and save the user
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
      user.isVerified = true;
      user.status = "Active";
      user.save(function(err) {
        if (err) {
          return res.status(500).send(err.message);
        }
        res.status(200).send("The account has been verified. Please log in.");
      });
    });
  });
});

module.exports = router;
