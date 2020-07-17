const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const handlebars = require("handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const methodOverride = require("method-override");
const path = require("path");
const sharp = require("sharp");

// Moment
//const moment = require("moment");
//const date = moment("DD-MM-YYYY");

// Upload image
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

const upload = multer({ storage: storage });

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
    handlebars: allowInsecurePrototypeAccess(handlebars),
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
  category: String,
  date: Date,
  created_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
  cover: {
    name: String,
    originalname: String,
    path: String,
    createAt: Date,
  },
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
      res.render("list", {
        recipe: recipe,
      });
    } else {
      res.send(err);
    }
  });
});

// Post.hbs
app
  .route("/post")
  .get((req, res) => {
    res.render("post");
  })
  .post(upload.single("cover"), (req, res) => {
    const file = req.file;

    const newRecipe = new Recipe({
      title: req.body.title,
      ingredients: req.body.ingredients,
      content: req.body.content,
      category: req.body.category,
    });

    if (file) {
      newRecipe.cover = {
        name: file.filename,
        originalname: file.originalname,
        path: file.path.replace("public", ""),
        createAt: Date.now(),
      };
    }

    newRecipe.save(function (err) {
      if (!err) {
        res.send("Nouvelle recette ajoutée avec succès !");
      } else {
        res.send(err);
      }
    });
  });

// Put.hbs
app.route("/put").get((req, res) => {
  Recipe.find(function (err, recipe) {
    if (!err) {
      res.render("put", {
        recipe: recipe,
      });
    } else {
      res.send(err);
    }
  });
});

// Delete.hbs
// app
//   .route("/delete")
//   .get((req, res) => {
//     res.render("delete");
//   })
//   .delete(function (req, res) {
//     Recipe.deleteMany(function (err) {
//       if (!err) {
//         res.send("Toutes les recettes ont été effacées !");
//       } else {
//         res.send(err);
//       }
//     });
//   });

// ROUTE edition

app
  .route("/:id")
  .get(function (req, res) {
    Recipe.findOne({ _id: req.params.id }, function (err, recipe) {
      if (!err) {
        res.render("put", {
          _id: recipe.id,
          title: recipe.title,
          ingredients: recipe.ingredients,
          content: recipe.content,
        });
      } else {
        res.send(err);
      }
    });
  })
  .put(function (req, res) {
    Recipe.update(
      //condition
      { _id: req.params.id },
      //update
      {
        title: req.body.title,
        ingredients: req.body.ingredients,
        content: req.body.content,
        category: req.body.category,
      },
      //option
      { multi: true },
      //exec
      function (err) {
        if (!err) {
          res.send("Recette modifiée avec succès !");
        } else {
          res.send(err);
        }
      }
    );
  })
  .delete(function (req, res) {
    Recipe.deleteOne({ _id: req.params.id }, function (err) {
      if (!err) {
        res.send("Recette effacée avec succès !");
      } else {
        res.send(err);
      }
    });
  });

// SERVER

app.listen(port, function () {
  console.log(
    `écoute le port ${port}, lancé à : ${new Date().toLocaleString()}`
  );
});
