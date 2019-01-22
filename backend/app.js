const express = require("express");
const bodyPaser = require("body-parser");
const mongoose = require("mongoose");

const postsRoutes = require("./routes/posts");
const app = express();

mongoose
  .connect(
    "mongodb+srv://max:RY9SH0NmSsCAedJt@cluster0-nk2zw.mongodb.net/node-angular?retryWrites=true"
  )
  .then(() => {
    console.log("Connected to database!!");
  })
  .catch(() => {
    console.log("Connection failed!!");
  });

app.use(bodyPaser.json());
app.use(bodyPaser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PATCH,PUT,DELETE,OPTIONS"
  );
  next();
});

app.use("/api/posts", postsRoutes);

module.exports = app;
