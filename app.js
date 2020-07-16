const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const Handlebars = require('handlebars')
const {
    allowInsecurePrototypeAccess,
  } = require("@handlebars/allow-prototype-access");
  const methodOverride = require("method-override");
  const path = require("path");
  const sharp = require("sharp");

  