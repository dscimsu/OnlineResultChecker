let express = require("express");
let router = express.Router();



//home page route
router.get("/", function (req, res, next) {
  res.render("index", { title: "ResultTracker" });
});

//contact route
router.get('/contact', function (req, res, next) {
  res.render('contact');
});

//about FAQ route
router.get("/about", function (req, res, next) {
  res.render("about");
});


// check results route
router.get("/checkresults", function (req, res, next) {
  res.render("checkresults", { title: "ResultTracker" });
});
module.exports = router;

