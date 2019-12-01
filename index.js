//Core
const config = require("config");
const express = require("express");
const cors = require("cors");
const app = express();
const port = 4000;
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const proxy = require("http-proxy-middleware");

//Authorization Middleware
const checkToken = require("./middleware/auth");

//Routes
const users = require("./routes/users");
const auth = require("./routes/auth");
//const errorlog = require("./routes/errors");
const confirm = require("./routes/confirm");

//export polls_jwtPrivateKey=secretkey
//export NODE_ENV=production
//export PRODUCTION_ENV_DB=mongodb://localhost/global?replicaSet=rs
/*
 * sudo mongo
 * use admin
 * db.shutdownServer()
 * exit
 * mongod --port 27017 --dbpath /data/db --replSet rs0 --bind_ip localhost
 */
require("dotenv").config();

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined");
  process.exit(1);
}
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "localhost:3000"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

//IMG PROXY
app.use(
  proxy("/assets/img/**/*.jpg", {
    target: "https://www.someOtherServer.com",
    changeOrigin: true,
    pathRewrite: { "^/assets/img": "/OtherServers/Assets" }
  })
);

//Secure API Routes
app.use("/api/secure", checkToken);

//Route Middleware
app.use("/api/auth", auth);
app.use("/api/users", users);
app.use("/api/confirm", confirm);

//DEV DB
//"mongodb://localhost:27017/global"

if (process.env.NODE_ENV === "production") {
  mongoose
    .connect(`mongodb://localhost/${process.env.DB_NAME}?replicaSet=rs`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => console.log("Connected to PRODUCTION Mongo..."))
    .catch(err => console.error("Could not connect...", err));

  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    console.log("conn");
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
} else {
  mongoose
    .connect(`mongodb://localhost:27017/${process.env.DB_NAME}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => console.log("Connected to DEV Mongo..."))
    .catch(err => console.error("Could not connect...", err));
  app.use(express.static("client/public"));
}

app.listen(port, function() {
  console.log(`Global API on Port ${port}!`);
});
