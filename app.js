// required files
const mongoose = require("mongoose"),
  express = require("express"),
  app = express(),
  cookieParser = require("cookie-parser"),
  cors = require("cors");
require("dotenv").config();
const passport = require("passport"),
  LocalStrategy = require("passport-local");
var session = require("express-session");
var flash = require("connect-flash");

// connecting  MONGODB
// mongoose
//   .connect(process.env.MONGO_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("DB Connection successful");
//   })
//   .catch(() => {
//     console.log("Unable to connect to DB");
//   });
const connectDb = async () => {
  await mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(
      () => {
        console.info(`Connected to database`);
      },
      (error) => {
        console.error(`Connection error: ${error.stack}`);
        process.exit(1);
      }
    );
};

connectDb().catch((error) => console.error(error));

//   middleware
app.use(
  require("express-session")({
    secret: "just a try",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});
app.use(express.json()); //body-parser
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(cookieParser());
app.use(cors());
app.set("views", __dirname + "/views");
app.engine("html", require("ejs").renderFile);
app.set("view engine", "ejs");

// importing routes
const index = require("./routes/index");
const admin = require("./routes/admin");
const NGO = require("./routes/NGO");
const market = require("./routes/market");
const choosereq = require("./routes/choosereq");
const chosengo = require("./routes/chosengo");
const request1 = require("./routes/request");

// using routes
app.use("/", index);
app.use("/NGO", NGO);
app.use("/admin", admin);
app.use("/market", market);
app.use("/donateToCalls", choosereq);
app.use("/choseNGO", chosengo);
app.use("/request", request1);

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

// port
const port = process.env.PORT || 8080;

// server start
app.listen(port, () => {
  console.log(`Port started on ${port}`);
});
