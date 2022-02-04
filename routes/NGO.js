const NGO = require("../models/NGO");
const express = require("express"),
  router = express.Router(),
  passport = require("passport"),
  LocalStrategy = require("passport-local");
const bcrypt = require("bcryptjs");

// middle ware

router.use(
  require("express-session")({
    secret: "just a try",
    resave: false,
    saveUninitialized: false,
  })
);
router.use(passport.initialize());
router.use(passport.session());
passport.use(
  "NGOLocal",
  new LocalStrategy(
    {
      usernameField: "email",
    },
    NGO.authenticate()
  )
);

router.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

passport.serializeUser(NGO.serializeUser());
passport.deserializeUser(NGO.deserializeUser());

// signup
router.get("/signup", (req, res) => {
  res.render("../views/ngosignup.html");
});

router.post("/signup", function (req, res) {
  NGO.register(
    new NGO({
      NGOname: req.body.NGOname,
      Uname: req.body.Uname,
      username: req.body.email,
      phone: req.body.phone,
      BankName: req.body.bname,
      BankAccountNumber: req.body.bnumber,
      details: req.body.detail,
      email: req.body.email,
      Btype: req.body.Btype,
      password: req.body.password,
    }),
    req.body.password,
    function (err, ngo) {
      if (err) {
        console.log(err);
        return res.render("../views/ngosignup.html");
      }
      passport.authenticate("local")(req, res, function () {
        res.redirect("/");
      });
    }
  );
});

// signin
router.get("/signin", (req, res) => {
  res.render("../views/ngologin.html");
});
router.post(
  "/signin",
  passport.authenticate("NGOLocal", {
    successRedirect: "/", // redirect back to the previous page
    failureRedirect: "/NGO/signin", // redirect back to the previous page
    failureFlash: true,
    successFlash: true,
    // successFlash: "Welcome!",
  }),
  function (req, res) {
    res.send("welcome to login");
  }
);

router.get("/", (req, res) => {
  return res.send("Hello World");
});

function checkAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    //req.isAuthenticated() will return true if user is logged in
    next();
  } else {
    res.redirect("/NGO/signin");
  }
}

module.exports = router;
