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
    useUnifiedTopology: true,
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
app.route("/").get((req, res) => {
  Recipe.find(function (err, recipe) {
    if (!err) {
      res.render("index", {
        recipe: recipe,
      });
    } else {
      res.send(err);
    }
  });
});

// STARTERS
app.route("/starters").get((req, res) => {
  res.render("starters");
});

// salads
app.route("/salads").get((req, res) => {
  res.render("salads");
});

// hot_starters
app.route("/hot_starters").get((req, res) => {
  res.render("hot_starters");
});

// cold_starters
app.route("/cold_starters").get((req, res) => {
  res.render("cold_starters");
});

// MAIN_COURSE
app.route("/main_course").get((req, res) => {
  res.render("main_course");
});

// meat
app.route("/meat").get((req, res) => {
  res.render("meat");
});

// fish
app.route("/fish").get((req, res) => {
  res.render("fish");
});

// soup
app.route("/soup").get((req, res) => {
  res.render("soup");
});

// DESSERTS
app.route("/desserts").get((req, res) => {
  res.render("desserts");
});

// entremets
app.route("/entremets").get((req, res) => {
  res.render("entremets");
});

// pies
app.route("/pies").get((req, res) => {
  res.render("pies");
});

// ice_cream
app.route("/ice_cream").get((req, res) => {
  res.render("ice_cream");
});

// ADMIN

// List.hbs
app.route("/list").get((req, res) => {
  Recipe.find(function (err, recipe) {
    if (!err) {
      res.render("index", {
        recipe: recipe,
      });
    } else {
      res.send(err);
    }
  });
  res.render("list");
});

// Post.hbs
app.route("/post").get((req, res) => {
  res.render("post");
});

// Put.hbs
app.route("/put").get((req, res) => {
  res.render("put");
});

// Post.hbs
app.route("/delete").get((req, res) => {
  res.render("delete");
});

// SERVER

app.listen(port, function () {
  console.log(
    `écoute le port ${port}, lancé à : ${new Date().toLocaleString()}`
  );
});
