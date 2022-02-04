const Market = require("../models/market");
const express = require("express"),
  router = express.Router();

router.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

router.get("/", (req, res) => {
  Market.find({}, function (err, allProduct) {
    if (err) {
      console.log(err);
    } else {
      res.render("../views/market.html", { products: allProduct });
    }
  });
});

router.get("/newProduct", (req, res) => {
  res.render("../views/newProduct.html");
});

router.post("/newProduct", checkAuthentication, (req, res) => {
  Market.create(
    {
      username: req.user,
      name: req.body.name,
      price: req.body.price,
      gType: req.body.gType,
      image: req.body.image,
    },
    function (err, market) {
      if (err) {
        console.log(err);
      } else {
        console.log("product added successfully");
        res.redirect("/market/");
      }
    }
  );
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
