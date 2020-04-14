//getting check result page


exports.getCheckResultPage = (req, res, next) => {
    res.render("secondary/student/checkresults", { path: "/student/checkresults" });
  }