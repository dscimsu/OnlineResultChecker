let express = require("express");
let router = express.Router();
let Result = require("../models/result");

router.get("/", function (req, res, next) {
  res.render("index", { title: "ResultTracker" });
});

// check results route
router.get("/checkresults", function (req, res, next) {
  res.render("checkresults", { title: "ResultTracker" });
});

router.post("/app", function (req, res, next) {
  let objectData = req.body;
  delete objectData._csrf;
  req.session.resultData = objectData;
  req.session.gp = req.body.gp;
  res.redirect("save");
});

router.post("/save", isLoggedIn, function (req, res, next) {
  let result = new Result({
    user: req.user,
    semester: req.body.semester,
    level: req.body.level,
    year: req.body.year,
    gp: req.session.gp,
    resultsData: req.session.resultData,
  });
  result.save(function (err, result) {
    if (req.session.resultData == null) {
      req.flash("error", "SORRY NO CALCULATION WAS MADE");
    } else {
      req.session.resultData = null;
      req.session.gp = null;
      req.flash("success", "Saved Successfully");
    }

    res.redirect("/dashboard");
  });
});

router.get("/show", function (req, res, next) {
  res.render("user/show");
});

router.get("/about", function (req, res, next) {
  res.render("about");
});

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.oldUrl = req.url;
  res.redirect("/signin");
}
