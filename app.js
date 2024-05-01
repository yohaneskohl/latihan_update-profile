require('dotenv').config();
const express = require("express");
const logger = require("morgan");
const app = express();
const router = require("./routes")

app.use(router);
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use('/images', express.static('public/images'));
app.use('/videos', express.static('public/videos'));
app.use('/documents', express.static('public/documents'));
app.use('/audios', express.static('public/audios'));
app.set("view engine", "ejs");

const routes = require("./routes");
app.use("/api/v1", routes);
app.get("/images", (req, res) => res.render("image"));
app.get("/videos", (req, res) => res.render("video"));
app.get("/documents", (req, res) => res.render("document"));
app.get("/audios", (req, res) => res.render("audio"));

// 500 error handler
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({
    status: false,
    message: err.message,
    data: null,
  });
});

// 404 error handler
app.use((req, res, next) => {
  res.status(404).json({
    status: false,
    message: `are you lost? ${req.method} ${req.url} is not registered!`,
    data: null,
  });
});

module.exports = app;