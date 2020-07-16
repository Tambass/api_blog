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

app.listen(port, function () {
  console.log(
    `écoute le port ${port}, lancé à : ${new Date().toLocaleString()}`
  );
});
