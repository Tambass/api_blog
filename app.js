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
    const ext = path.extname(file.originalname);
    const date = Date.now();
    cb(null, date + "-" + file.originalname);
    //cb(null, file.originalname + "-" + date + ext);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 4 * 4083 * 4083,
    files: 1,
  },
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/gif"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Le fichier doit être au format png, jpg, jpeg ou gif"));
    }
  },
});

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

const recipeSchema = new mongoose.Schema({
  title: String,
  ingredients: String,
  content: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
  },
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
    urlSharp: String,
    createAt: Date,
  },
});

const categoryShema = new mongoose.Schema({
  title: String,
});

const Recipe = mongoose.model("recipe", recipeSchema);
const Category = mongoose.model("category", categoryShema);

// ROUTES

// Category.hbs
app
  .route("/category")
  .get((req, res) => {
    Category.find((err, category) => {
      if (!err) {
        res.render("category", {
          category: category,
        });
      } else {
        res.send(err);
      }
    });
  })
  .post((req, res) => {
    const newCategory = new Category({
      title: req.body.title,
    });
    newCategory.save(function (err) {
      if (!err) {
        res.send("Nouvelle catégorie sauvegardée !");
      } else {
        res.send(err);
      }
    });
  });

// Index.hbs
app.route("/").get((req, res) => {
  Recipe.find()
    .populate("category")
    .exec(function (err, recipe) {
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
  Recipe.find()
    .populate("category")
    .exec(function (err, recipe) {
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
    Recipe.find()
      .populate("category")
      .exec(function (err, recipe) {
        if (!err) {
          Category.find(function (err, category) {
            res.render("post", {
              recipe: recipe,
              category: category,
            });
          });
        } else {
          res.send(err);
        }
      });
  })
  .post(upload.single("cover"), (req, res) => {
    const file = req.file;

    sharp(file.path)
      .resize({ width: 200 })
      .webp({ quality: 80 })
      .toFile(
        "./public/uploads/web/" +
          file.originalname.split(".").slice(0, -1).join(".") +
          ".webp",
        (err, info) => {}
      );

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
        urlSharp:
          "/uploads/web/" +
          file.originalname.split(".").slice(0, -1).join(".") +
          ".webp",
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
app
  .route("/delete")
  .get((req, res) => {
    res.render("delete");
  })
  .delete(function (req, res) {
    Recipe.deleteMany(function (err) {
      if (!err) {
        res.send("Toutes les recettes ont été effacées !");
      } else {
        res.send(err);
      }
    });
  });

// ROUTE edition

app
  .route("/:id")
  .get(function (req, res) {
    Recipe.findOne()
      .populate("category")
      .exec({ _id: req.params.id }, function (err, recipe) {
        if (!err) {
          Category.find(function (err, category) {
            res.render("put", {
              _id: recipe.id,
              title: recipe.title,
              ingredients: recipe.ingredients,
              content: recipe.content,
              category: category,
            });
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
