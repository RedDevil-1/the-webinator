const Admin = require("../models/admin");
const express = require("express"),
  router = express.Router(),
  passport = require("passport"),
  LocalStrategy = require("passport-local");

// middle ware

router.use(passport.initialize());
router.use(passport.session());
passport.use(
  "adminLocal",
  new LocalStrategy(
    {
      usernameField: "email",
    },
    Admin.authenticate()
  )
);

router.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());

// signup
router.get("/signup", (req, res) => {
  res.render("../views/adminsignup.html");
});

router.post("/signup", checkAuthentication, function (req, res) {
  Admin.register(
    new Admin({
      name: req.body.name,
      lastname: req.body.lastname,
      username: req.body.email,
      email: req.body.email,
      password: req.body.password,
    }),
    req.body.password,
    function (err, admin) {
      if (err) {
        console.log(err);
        return res.render("../views/adminsignup.html");
      }
      passport.authenticate("local")(req, res, function () {
        console.log(admin);
        res.redirect("/");
      });
    }
  );
});

// signin
router.get("/signin", (req, res) => {
  res.render("../views/adminlogin.html");
});
router.post(
  "/signin",
  passport.authenticate("adminLocal", {
    successRedirect: "/", // redirect back to the previous page
    failureRedirect: "back", // redirect back to the previous page
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
    res.redirect("/admin/signin");
  }
}

module.exports = router;
