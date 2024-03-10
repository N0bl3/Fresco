require("dotenv").config();
var debug = require("debug")("fresco:server");
var http = require("http");
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var app = express();
var expressWs = require('express-ws')(app);

// routes setup
const index = require(path.join(__dirname, "routes/index"))

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const { MongoClient, ServerApiVersion } = require("mongodb");
const client = new MongoClient(process.env.MONGODB_URI);
const dbName = "Fresco";

debug('loading db ', dbName);
let db, collection, pixels;
async function main() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    db = client.db(dbName);
    collection = db.collection("pixels");
  } catch (err) {
    console.error(err);
  }
}
main();

app.use(function (req, res, next) {
  req.collection = collection;
  next();
});

app.use("/", index)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

var port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

app.listen(port, () => {
  debug("Listening on port", port);
})

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

module.exports = app;
