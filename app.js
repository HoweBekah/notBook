const express = require("express");
const path = require("path");
const { Pool } = require("pg");
const PORT = process.env.PORT || 8080;
const connectionString =
  process.env.DATABASE_URL ||
  "postgres://qiuovznbemorvg:adb5026cdc938a4626f710bce26a2fae1e1cb4763a6bdb2b33d1fdc555441fc3@ec2-107-22-239-155.compute-1.amazonaws.com:5432/d87u5hv5p5cd3n?ssl=true";

var createError = require("http-errors");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const pool = new Pool({ connectionString: connectionString });
var sql = "Select * FROM category";
pool.query(sql, function(err, result) {
  if (err) {
    console.log("Error in query: ");
    console.log(err);
  }
  console.log("Back from DB with result:");
  console.log(result.rows);
});

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
