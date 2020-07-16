const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const Handlebars = require("handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const methodOverride = require("method-override");
const path = require("path");
const sharp = require("sharp");

// Express
const port = 8080;
const app = express();
app.use(express.static("public"));

//Method Override
app.use(methodOverride("_method"));

// Handlebars

app.engine(
  "hbs",
  exphbs({
    defaultLayout: "main",
    extname: "hbs",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);

app.set("view engine", "hbs");

// BodyParser

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// MongoDB

mongoose.connect("mongodb://localhost:27017/api_blog", {
  useNewUrlParser: true,
});

const recipeSchema = {
  title: String,
  ingredients: String,
  content: String,
};

const Recipe = mongoose.model("recipe", recipeSchema);

// ROUTES

// Index.hbs
app.get("/", (req, res) => {
  res.render("index");
});

// STARTERS
app.get("/starters", (req, res) => {
  res.render("starters");
});

// salads
app.get("/salads", (req, res) => {
  res.render("salads");
});

// hot_starters
app.get("/hot_starters", (req, res) => {
  res.render("hot_starters");
});

// cold_starters
app.get("/cold_starters", (req, res) => {
  res.render("cold_starters");
});

// MAIN_COURSE
app.get("/main_course", (req, res) => {
  res.render("main_course");
});

// meat
app.get("/meat", (req, res) => {
  res.render("meat");
});

// fish
app.get("/fish", (req, res) => {
  res.render("fish");
});

// soup
app.get("/soup", (req, res) => {
  res.render("soup");
});

// DESSERTS
app.get("/desserts", (req, res) => {
  res.render("desserts");
});

// entremets
app.get("/entremets", (req, res) => {
  res.render("entremets");
});

// pies
app.get("/pies", (req, res) => {
  res.render("pies");
});

// ice_cream
app.get("/ice_cream", (req, res) => {
  res.render("ice_cream");
});

// ADMIN

// List.hbs
app.get("/list", (req, res) => {
  res.render("list");
});

// Post.hbs
app.get("/post", (req, res) => {
  res.render("post");
});

// Put.hbs
app.get("/put", (req, res) => {
  res.render("put");
});

// Post.hbs
app.get("/delete", (req, res) => {
  res.render("delete");
});

app.listen(port, function () {
  console.log(
    `écoute le port ${port}, lancé à : ${new Date().toLocaleString()}`
  );
});
