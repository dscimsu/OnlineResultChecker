
// getting home page
exports.getHomePage = (req, res, next) => {
    res.render("index", { path: "/" });
}

// getting contact page
exports.getContactPage = (req, res, next) => {
    res.render('contact', { path: "/contact" });
  }

  //getting about page
  exports.getAboutPage = (req, res, next) => {
    res.render("about", { path: "/about" });
  }

  //getting check result page
  exports.getCheckResultPage = (req, res, next) => {
    res.render("secondary/student/checkresults", { path: "/checkresult" });
  }